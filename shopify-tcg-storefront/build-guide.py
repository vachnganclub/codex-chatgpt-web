#!/usr/bin/env python3
"""Dựng docs/*.md thành một trang guide.html tự chứa, đọc được trên điện thoại.

Markdown là nguồn sự thật duy nhất; file này chỉ render. Chạy lại sau mỗi lần sửa docs:
    python3 build-guide.py
"""
import html
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
DOCS = os.path.join(HERE, 'docs')

# token trên URL  ->  (file, nhãn ngắn, tiêu đề sidebar)
PAGES = [
    ('index', 'README.md',                     '',    'Tổng quan & thực trạng store'),
    ('done',  'TRIEN-KHAI.md',                 '✓',   'Đã triển khai thật — và phần còn lại'),
    ('s00',   'S00-thiet-lap-chung.md',        'S00', 'Thiết lập chung, tag, Markets'),
    ('s09',   'S09-header-footer-tien-te.md',  'S09', 'Header, Footer, bộ chọn tiền tệ'),
    ('s10',   'S10-collection.md',             'S10', 'Collection Pokémon / One Piece'),
    ('s01',   'S01-trang-chu.md',              'S01', 'Trang chủ'),
    ('s06',   'S06-trang-san-pham.md',         'S06', 'Trang chi tiết sản phẩm'),
    ('s07',   'S07-gio-hang.md',               'S07', 'Giỏ hàng'),
    ('s08',   'S08-thanh-toan.md',             'S08', 'Thanh toán'),
    ('s04',   'S04-wholesale-inquiry.md',      'S04', 'Form Wholesale Inquiry'),
    ('s05',   'S05-privacy-cookie.md',         'S05', 'Privacy & Cookie Policy'),
    ('s11',   'S11-feedback.md',               'S11', 'Trang Feedback'),
]
FILE_TO_TOKEN = {f: t for t, f, _, _ in PAGES}


# ---------------------------------------------------------------- inline
def inline(text):
    """Chuyển inline markdown. HTML viết tay trong .md được giữ nguyên; code span
    thì escape, nên `<handle>` không bị hiểu thành thẻ."""
    spans = []

    def stash(m):
        spans.append(html.escape(m.group(1)))
        return '\x00%d\x00' % (len(spans) - 1)

    text = re.sub(r'`([^`]+)`', stash, text)

    # link nội bộ sang file .md khác -> đổi thành token của trang đó
    def link(m):
        label, href = m.group(1), m.group(2)
        base = href.split('#')[0]
        name = os.path.basename(base)
        if name in FILE_TO_TOKEN:
            return '<a href="#%s" data-nav>%s</a>' % (FILE_TO_TOKEN[name], label)
        if base.endswith('.md'):          # file ngoài tập guide, bỏ link
            return label
        return '<a href="%s" target="_blank" rel="noopener">%s</a>' % (href, label)

    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', link, text)
    text = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'(?<![\w*])\*([^*\n]+)\*(?![\w*])', r'<em>\1</em>', text)

    for i, s in enumerate(spans):
        text = text.replace('\x00%d\x00' % i, '<code>%s</code>' % s)
    return text



BLOCK_START = re.compile(r'^(\||>|#{1,4}\s|```|[-*]\s|\d+[.)]\s|---$|\*\*\*$|___$)')


def continuation(lines, i, n, item):
    """Nối các dòng tiếp nối của một list item (lazy continuation), để chữ in đậm
    hay code span bắc qua nhiều dòng không bị cắt đôi."""
    while i < n:
        nxt = lines[i].strip()
        if not nxt or BLOCK_START.match(nxt):
            break
        item += ' ' + nxt
        i += 1
    return i, item

# ---------------------------------------------------------------- block
def render(md):
    out, i, lines = [], 0, md.split('\n')
    n = len(lines)
    while i < n:
        line = lines[i]
        stripped = line.strip()

        if not stripped:
            i += 1
            continue

        if stripped.startswith('```'):
            i += 1
            buf = []
            while i < n and not lines[i].strip().startswith('```'):
                buf.append(lines[i])
                i += 1
            i += 1
            out.append('<pre><code>%s</code></pre>' % html.escape('\n'.join(buf)))
            continue

        if stripped in ('---', '***', '___'):
            out.append('<hr>')
            i += 1
            continue

        m = re.match(r'^(#{1,4})\s+(.*)$', stripped)
        if m:
            lvl = len(m.group(1))
            out.append('<h%d>%s</h%d>' % (lvl, inline(m.group(2)), lvl))
            i += 1
            continue

        if stripped.startswith('|'):
            tbl = []
            while i < n and lines[i].strip().startswith('|'):
                tbl.append(lines[i].strip())
                i += 1
            out.append(table(tbl))
            continue

        if stripped.startswith('> '):
            buf = []
            while i < n and lines[i].strip().startswith('>'):
                buf.append(lines[i].strip().lstrip('>').strip())
                i += 1
            out.append('<blockquote>%s</blockquote>' % inline(' '.join(buf)))
            continue

        if re.match(r'^[-*]\s+', stripped):
            items, checklist, i = [], False, i
            while i < n and re.match(r'^[-*]\s+', lines[i].strip()):
                item = re.sub(r'^[-*]\s+', '', lines[i].strip())
                i += 1
                i, item = continuation(lines, i, n, item)
                cb = re.match(r'^\[([ xX])\]\s*(.*)$', item)
                if cb:
                    checklist = True
                    item = cb.group(2)
                items.append('<li>%s</li>' % inline(item))
            out.append('<ul%s>%s</ul>' % (' class="check"' if checklist else '', ''.join(items)))
            continue

        if re.match(r'^\d+[.)]\s+', stripped):
            items = []
            start = re.match(r'^(\d+)', stripped).group(1)
            while i < n and re.match(r'^\d+[.)]\s+', lines[i].strip()):
                item = re.sub(r'^\d+[.)]\s+', '', lines[i].strip())
                i += 1
                i, item = continuation(lines, i, n, item)
                items.append('<li>%s</li>' % inline(item))
            out.append('<ol start="%s">%s</ol>' % (start, ''.join(items)))
            continue

        buf = []
        while i < n and lines[i].strip() and not re.match(
                r'^(\||>|#{1,4}\s|```|[-*]\s|\d+[.)]\s|---$)', lines[i].strip()):
            buf.append(lines[i].strip())
            i += 1
        out.append('<p>%s</p>' % inline(' '.join(buf)))
    return '\n'.join(out)


def cells(row):
    row = row.strip()
    if row.startswith('|'):
        row = row[1:]
    if row.endswith('|'):
        row = row[:-1]
    return [c.strip() for c in row.split('|')]


def table(rows):
    if len(rows) < 2:
        return ''
    head = cells(rows[0])
    body = rows[2:] if re.match(r'^\|[\s:|-]+\|?$', rows[1]) else rows[1:]
    th = ''.join('<th>%s</th>' % inline(c) for c in head)
    tr = ''.join(
        '<tr>%s</tr>' % ''.join('<td>%s</td>' % inline(c) for c in cells(r))
        for r in body
    )
    return ('<div class="tablewrap"><table><thead><tr>%s</tr></thead>'
            '<tbody>%s</tbody></table></div>' % (th, tr))


# ---------------------------------------------------------------- page
CSS = """
:root{
  --paper:#EEF0F4;--surface:#FFFFFF;--surface-2:#F6F7FA;--surface-3:#E7EAF0;
  --line:#D5DAE3;--line-strong:#B9C1CF;--ink:#121622;--ink-2:#39414F;--muted:#636D80;
  --volt:#1F4ED8;--volt-soft:#E1E8FD;--foil:#A9740A;--foil-soft:#FBEFD4;
  --stop:#A3221B;--stop-soft:#FBE3E1;--ok:#17683C;--ok-soft:#DFF2E6;--warn:#8A5A06;--warn-soft:#FCEFD6;
  --bar-bg:#111621;--bar-fg:#E7EAF1;
  --display:"Bricolage Grotesque","Trebuchet MS",system-ui,sans-serif;
  --body:"Public Sans","Helvetica Neue",Arial,sans-serif;
  --mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --paper:#0C0F15;--surface:#141922;--surface-2:#1B212C;--surface-3:#232B38;
  --line:#2A3240;--line-strong:#3C465A;--ink:#E9ECF3;--ink-2:#C2C9D6;--muted:#949EB1;
  --volt:#7A9DFF;--volt-soft:#1B2740;--foil:#E7B544;--foil-soft:#2D2413;
  --stop:#FF9288;--stop-soft:#301512;--ok:#73D79B;--ok-soft:#10261A;--warn:#E8BA62;--warn-soft:#2B2110;
  --bar-bg:#1A2029;--bar-fg:#E9ECF3;color-scheme:dark;}}
:root[data-theme="dark"]{
  --paper:#0C0F15;--surface:#141922;--surface-2:#1B212C;--surface-3:#232B38;
  --line:#2A3240;--line-strong:#3C465A;--ink:#E9ECF3;--ink-2:#C2C9D6;--muted:#949EB1;
  --volt:#7A9DFF;--volt-soft:#1B2740;--foil:#E7B544;--foil-soft:#2D2413;
  --stop:#FF9288;--stop-soft:#301512;--ok:#73D79B;--ok-soft:#10261A;--warn:#E8BA62;--warn-soft:#2B2110;
  --bar-bg:#1A2029;--bar-fg:#E9ECF3;color-scheme:dark;}
*,*::before,*::after{box-sizing:border-box}
[hidden]{display:none!important}
body{background:var(--paper);color:var(--ink);font-family:var(--body);font-size:15px;line-height:1.6;margin:0}
.topbar{background:var(--bar-bg);color:var(--bar-fg);position:sticky;top:env(safe-area-inset-top,0px);z-index:30}
.topbar .in{max-width:1240px;margin-inline:auto;padding:10px 20px;display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.topbar .name{font-family:var(--display);font-weight:800;font-size:1rem;letter-spacing:-.02em}
.topbar .sub{font-family:var(--mono);font-size:.66rem;letter-spacing:.1em;text-transform:uppercase;opacity:.72}
.topbar .sp{flex:1 1 20px}
.topbar button{background:transparent;border:1px solid rgba(255,255,255,.28);color:inherit;border-radius:999px;
  padding:4px 12px;font-family:var(--mono);font-size:.66rem;letter-spacing:.06em;text-transform:uppercase;cursor:pointer}
.topbar button:hover{border-color:rgba(255,255,255,.6)}
.wrap{max-width:1240px;margin-inline:auto;padding:24px 20px 72px;display:grid;
  grid-template-columns:252px minmax(0,1fr);gap:30px;align-items:start}
.side{position:sticky;top:calc(env(safe-area-inset-top,0px) + 62px);background:var(--surface);
  border:1px solid var(--line);border-radius:10px;padding:12px}
.side h2{font-family:var(--mono);font-size:.62rem;letter-spacing:.12em;text-transform:uppercase;
  color:var(--muted);font-weight:500;margin:4px 0 10px 6px}
.side a{display:grid;grid-template-columns:38px minmax(0,1fr);gap:8px;align-items:baseline;
  padding:7px 8px;border-radius:7px;text-decoration:none;color:var(--ink-2);font-size:.86rem}
.side a:hover{background:var(--surface-2);color:var(--ink)}
.side a[aria-current="page"]{background:var(--ink);color:var(--surface)}
.side a[aria-current="page"] .code{color:var(--surface)}
.side .code{font-family:var(--mono);font-size:.68rem;letter-spacing:.05em;color:var(--volt)}
main{min-width:0;background:var(--surface);border:1px solid var(--line);border-radius:10px;
  padding:clamp(18px,3vw,36px)}
h1,h2,h3,h4{font-family:var(--display);line-height:1.15;text-wrap:balance;margin:0}
h1{font-size:clamp(1.6rem,3.6vw,2.25rem);font-weight:800;letter-spacing:-.025em;margin-bottom:14px}
h2{font-size:clamp(1.15rem,2.2vw,1.5rem);font-weight:700;letter-spacing:-.015em;margin:34px 0 12px;
  padding-top:18px;border-top:1px solid var(--line)}
main>h2:first-of-type{border-top:0;padding-top:0}
h3{font-size:1.02rem;font-weight:700;margin:24px 0 9px}
h4{font-size:.92rem;font-weight:700;margin:18px 0 7px}
p{margin:0 0 12px;max-width:74ch}
a{color:var(--volt);text-underline-offset:2px}
hr{border:0;border-top:1px solid var(--line);margin:28px 0}
ul,ol{margin:0 0 14px;padding-left:22px;max-width:74ch}
li{margin-bottom:5px}
ul.check{list-style:none;padding-left:0}
ul.check li{display:flex;gap:10px;align-items:flex-start}
ul.check li::before{content:"";width:15px;height:15px;flex:0 0 auto;margin-top:4px;
  border:1.5px solid var(--line-strong);border-radius:4px}
code{font-family:var(--mono);font-size:.84em;background:var(--surface-2);border:1px solid var(--line);
  border-radius:4px;padding:1px 5px;word-break:break-word}
pre{background:var(--surface-2);border:1px solid var(--line);border-radius:8px;padding:13px 15px;
  overflow-x:auto;margin:0 0 14px}
pre code{background:none;border:0;padding:0;font-size:.8rem;line-height:1.55;white-space:pre}
blockquote{margin:0 0 14px;padding:12px 15px;background:var(--warn-soft);border:1px solid var(--line);
  border-left:3px solid var(--warn);border-radius:6px;color:var(--ink-2);max-width:74ch}
blockquote code{background:var(--surface)}
.tablewrap{overflow-x:auto;margin:0 0 16px;border:1px solid var(--line);border-radius:8px}
table{border-collapse:collapse;width:100%;min-width:480px;font-size:.87rem}
th,td{text-align:left;padding:9px 12px;border-bottom:1px solid var(--line);vertical-align:top}
tr:last-child td{border-bottom:0}
thead th{background:var(--surface-2);font-family:var(--mono);font-size:.64rem;letter-spacing:.08em;
  text-transform:uppercase;color:var(--muted);font-weight:500;white-space:nowrap}
td strong{color:var(--ink)}
.side-toggle{display:none}
@media (max-width:900px){
  .wrap{grid-template-columns:minmax(0,1fr);gap:16px}
  .side{position:static}
  .side-toggle{display:inline-flex}
  .side[data-collapsed="true"] nav{display:none}
}
@media (max-width:560px){
  .wrap{padding-inline:16px}
  .topbar .in{padding-inline:16px}
  table{min-width:380px}
}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
"""

JS = """
const tokens = TOKENS__;
function show(tok){
  if (tokens.indexOf(tok) === -1) tok = 'index';
  tokens.forEach(t => { document.getElementById('doc-' + t).hidden = (t !== tok); });
  document.querySelectorAll('.side a').forEach(a => {
    if (a.getAttribute('href') === '#' + tok) a.setAttribute('aria-current','page');
    else a.removeAttribute('aria-current');
  });
  const s = document.getElementById('side');
  if (window.matchMedia('(max-width: 900px)').matches) s.dataset.collapsed = 'true';
  window.scrollTo({ top: 0, behavior: 'instant' });
}
window.addEventListener('hashchange', () => show((location.hash || '#index').slice(1)));
document.getElementById('side-toggle').addEventListener('click', () => {
  const s = document.getElementById('side');
  s.dataset.collapsed = s.dataset.collapsed === 'true' ? 'false' : 'true';
});
document.getElementById('theme').addEventListener('click', (e) => {
  const on = e.currentTarget.getAttribute('aria-pressed') !== 'true';
  e.currentTarget.setAttribute('aria-pressed', String(on));
  document.documentElement.setAttribute('data-theme', on ? 'dark' : 'light');
});
show((location.hash || '#index').slice(1));
"""


def build():
    nav, docs = [], []
    for tok, fname, code, label in PAGES:
        with open(os.path.join(DOCS, fname), encoding='utf-8') as fh:
            body = render(fh.read())
        docs.append('<section id="doc-%s" hidden>%s</section>' % (tok, body))
        nav.append('<a href="#%s" data-nav><span class="code">%s</span><span>%s</span></a>'
                   % (tok, code or '—', label))

    out = []
    out.append('<title>Triển khai ADAMANTILE TCG</title>')
    out.append('<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">')
    out.append('<link rel="preconnect" href="https://fonts.googleapis.com">')
    out.append('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>')
    out.append('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
               'family=Bricolage+Grotesque:opsz,wght@12..96,400..800&'
               'family=Public+Sans:wght@400..700&family=IBM+Plex+Mono:wght@400;500&display=swap">')
    out.append('<style>%s</style>' % CSS)
    out.append('<div class="topbar"><div class="in">'
               '<span class="name">ADAMANTILE TCG</span>'
               '<span class="sub">Tài liệu triển khai S00–S11</span>'
               '<span class="sp"></span>'
               '<button type="button" id="side-toggle" class="side-toggle">Mục lục</button>'
               '<button type="button" id="theme" aria-pressed="false">Nền tối</button>'
               '</div></div>')
    out.append('<div class="wrap">')
    out.append('<aside class="side" id="side" data-collapsed="false">'
               '<h2>Hạng mục</h2><nav>%s</nav></aside>' % ''.join(nav))
    out.append('<main>%s</main>' % ''.join(docs))
    out.append('</div>')
    out.append('<script>%s</script>' % JS.replace(
        'TOKENS__', repr([t for t, _, _, _ in PAGES]).replace("'", '"')))

    target = os.path.join(HERE, 'guide.html')
    with open(target, 'w', encoding='utf-8') as fh:
        fh.write('\n'.join(out))
    print('guide.html: %d bytes, %d trang' % (os.path.getsize(target), len(PAGES)))


if __name__ == '__main__':
    build()
