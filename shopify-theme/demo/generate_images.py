"""Generates original demo artwork (no third-party characters or logos) for the TCG Vault demo store."""
import math, os, random
from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT = os.path.join(os.path.dirname(__file__), 'images')
os.makedirs(OUT, exist_ok=True)
BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
REG = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'

def font(size, bold=True):
    return ImageFont.truetype(BOLD if bold else REG, size)

def hexrgb(h):
    h = h.lstrip('#'); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def gradient(size, c1, c2, vertical=True):
    w, h = size
    img = Image.new('RGB', size, c1)
    d = ImageDraw.Draw(img)
    steps = h if vertical else w
    for i in range(steps):
        t = i / max(steps - 1, 1)
        c = tuple(int(c1[k] + (c2[k] - c1[k]) * t) for k in range(3))
        if vertical: d.line([(0, i), (w, i)], fill=c)
        else: d.line([(i, 0), (i, h)], fill=c)
    return img

def emblem(d, cx, cy, r, kind, color):
    if kind == 'flame':
        pts = []
        for i in range(48):
            a = 2 * math.pi * i / 48
            rr = r * (0.75 + 0.25 * math.sin(5 * a))
            pts.append((cx + rr * math.sin(a), cy - rr * math.cos(a) * 1.15))
        d.polygon(pts, fill=color)
    elif kind == 'drop':
        d.ellipse([cx - r * .8, cy - r * .2, cx + r * .8, cy + r * 1.1], fill=color)
        d.polygon([(cx - r * .72, cy + r * .2), (cx + r * .72, cy + r * .2), (cx, cy - r * 1.1)], fill=color)
    elif kind == 'leaf':
        d.ellipse([cx - r * .55, cy - r, cx + r * .55, cy + r], fill=color)
        d.line([(cx, cy - r * .9), (cx, cy + r * 1.1)], fill=(255, 255, 255), width=max(3, r // 12))
    elif kind == 'bolt':
        d.polygon([(cx + r * .2, cy - r), (cx - r * .6, cy + r * .15), (cx - r * .05, cy + r * .15),
                   (cx - r * .3, cy + r), (cx + r * .6, cy - r * .2), (cx + r * .05, cy - r * .2)], fill=color)
    elif kind == 'star':
        pts = []
        for i in range(10):
            a = math.pi * i / 5 - math.pi / 2
            rr = r if i % 2 == 0 else r * .45
            pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
        d.polygon(pts, fill=color)
    elif kind == 'wheel':
        d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=color, width=max(6, r // 7))
        d.ellipse([cx - r * .25, cy - r * .25, cx + r * .25, cy + r * .25], fill=color)
        for i in range(8):
            a = math.pi * i / 4
            d.line([(cx, cy), (cx + r * 1.15 * math.cos(a), cy + r * 1.15 * math.sin(a))], fill=color, width=max(5, r // 9))
    elif kind == 'skull':
        d.ellipse([cx - r * .8, cy - r, cx + r * .8, cy + r * .5], fill=color)
        d.rectangle([cx - r * .45, cy + r * .2, cx + r * .45, cy + r * .75], fill=color)
        d.ellipse([cx - r * .5, cy - r * .45, cx - r * .1, cy - r * .05], fill=(30, 30, 40))
        d.ellipse([cx + r * .1, cy - r * .45, cx + r * .5, cy - r * .05], fill=(30, 30, 40))
        for s in (-1, 1):
            d.line([(cx - r * 1.2, cy + r * (0.9 if s > 0 else 1.25)), (cx + r * 1.2, cy + r * (1.25 if s > 0 else 0.9))], fill=color, width=max(8, r // 6))
    elif kind == 'anchor':
        w = max(8, r // 6)
        d.ellipse([cx - r * .25, cy - r * 1.05, cx + r * .25, cy - r * .55], outline=color, width=w)
        d.line([(cx, cy - r * .55), (cx, cy + r)], fill=color, width=w)
        d.line([(cx - r * .5, cy - r * .25), (cx + r * .5, cy - r * .25)], fill=color, width=w)
        d.arc([cx - r * .9, cy - r * .1, cx + r * .9, cy + r * 1.05], 20, 160, fill=color, width=w)
    else:
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color)

def card(w, h, title, sub, colors, kind, stars, foil=False, line='POKÉMON-STYLE'):
    """One trading card face, original design."""
    c1, c2 = hexrgb(colors[0]), hexrgb(colors[1])
    rad = int(w * .06)
    img = Image.new('RGBA', (w, h), (235, 196, 70, 255) if line != 'OP' else (40, 40, 52, 255))
    inner = gradient((w - 2 * int(w * .05), h - 2 * int(w * .05)), c1, c2)
    mask = Image.new('L', inner.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, inner.size[0] - 1, inner.size[1] - 1], int(rad * .7), fill=255)
    img.paste(inner, (int(w * .05), int(w * .05)), mask)
    d = ImageDraw.Draw(img)
    pad = int(w * .09)
    # title bar
    d.rounded_rectangle([pad, pad, w - pad, pad + int(h * .08)], int(w * .02), fill=(244, 244, 248))
    tf = font(int(h * .042))
    d.text((pad + int(w * .04), pad + int(h * .04)), title, font=tf, fill=(25, 25, 35), anchor='lm')
    # art window
    ax0, ay0, ax1, ay1 = pad, pad + int(h * .1), w - pad, pad + int(h * .53)
    art = gradient((ax1 - ax0, ay1 - ay0), tuple(min(255, v + 60) for v in c1), c2, vertical=False)
    ad = ImageDraw.Draw(art)
    rnd = random.Random(title)
    for _ in range(14):
        rr = rnd.randint(10, int(w * .12))
        x, y = rnd.randint(0, art.size[0]), rnd.randint(0, art.size[1])
        ad.ellipse([x - rr, y - rr, x + rr, y + rr], fill=tuple(min(255, v + 40) for v in c1))
    art = art.filter(ImageFilter.GaussianBlur(6))
    ad = ImageDraw.Draw(art)
    emblem(ad, art.size[0] // 2, art.size[1] // 2, int(min(art.size) * .3), kind, (255, 255, 255))
    if foil:
        sheen = Image.new('RGBA', art.size, (0, 0, 0, 0))
        sd = ImageDraw.Draw(sheen)
        for i in range(-art.size[1], art.size[0], 38):
            sd.line([(i, art.size[1]), (i + art.size[1], 0)], fill=(255, 255, 255, 55), width=14)
        art = Image.alpha_composite(art.convert('RGBA'), sheen)
    img.paste(art.convert('RGB'), (ax0, ay0))
    d.rectangle([ax0, ay0, ax1, ay1], outline=(255, 255, 255), width=max(3, w // 120))
    # text box
    by0 = ay1 + int(h * .03)
    d.rounded_rectangle([pad, by0, w - pad, h - pad - int(h * .06)], int(w * .02), fill=(240, 240, 245))
    sf = font(int(h * .03), bold=False)
    d.text((pad + int(w * .04), by0 + int(h * .05)), sub, font=sf, fill=(40, 40, 50), anchor='lm')
    for i in range(3):
        y = by0 + int(h * .11) + i * int(h * .045)
        d.line([(pad + int(w * .04), y), (w - pad - int(w * .04) - (i * int(w * .12)), y)], fill=(170, 170, 180), width=max(2, h // 220))
    # rarity stars
    for i in range(stars):
        emblem(d, w - pad - int(w * .05) - i * int(w * .07), h - pad - int(h * .025), int(w * .028), 'star', (255, 215, 0))
    d.text((pad, h - pad - int(h * .025)), 'DEMO', font=font(int(h * .028)), fill=(255, 255, 255), anchor='lm')
    outer = Image.new('L', (w, h), 0)
    ImageDraw.Draw(outer).rounded_rectangle([0, 0, w - 1, h - 1], rad, fill=255)
    img.putalpha(outer)
    return img

def drop_shadow(img, alpha, blur, pad=80):
    sh = Image.new('RGBA', (img.size[0] + 2 * pad, img.size[1] + 2 * pad), (0, 0, 0, 0))
    solid = Image.new('RGBA', img.size, (0, 0, 0, alpha))
    sh.paste(solid, (pad, pad), mask=img.split()[3])
    return sh.filter(ImageFilter.GaussianBlur(blur)), pad

def product_shot(card_img, size=(1000, 1333), bg='#f2f3f7', stack=1, label=None):
    W, H = size
    canvas = gradient(size, hexrgb('#ffffff'), hexrgb(bg)).convert('RGBA')
    cw = int(W * .62); ch = int(cw * 88 / 63)
    c = card_img.resize((cw, ch), Image.LANCZOS)
    for i in range(stack - 1, -1, -1):
        off = i * int(W * .045)
        rot = c.convert('RGBa').rotate((i - (stack - 1) / 2) * 6, expand=True, resample=Image.BICUBIC).convert('RGBA')
        shadow, sp = drop_shadow(rot, 70, 18)
        x = (W - rot.size[0]) // 2 + off - (stack - 1) * int(W * .022)
        y = (H - rot.size[1]) // 2 - off // 2 + (int(H * .03) if label else 0)
        canvas.alpha_composite(shadow, (x + 12 - sp, y + 18 - sp))
        canvas.alpha_composite(rot, (x, y))
    if label:
        d = ImageDraw.Draw(canvas)
        f = font(int(H * .045))
        tw = d.textlength(label, font=f)
        x0 = (W - tw) // 2 - 30
        d.rounded_rectangle([x0, int(H * .05), x0 + tw + 60, int(H * .05) + int(H * .075)], 18, fill=hexrgb('#c2185b'))
        d.text((W // 2, int(H * .05) + int(H * .0375)), label, font=f, fill='white', anchor='mm')
    return canvas.convert('RGB')

# ---------- product catalogue (demo) ----------
PK = [
    ('pk-ember-drake', 'Ember Drake', 'Fire · Basic', ('#ff7a3d', '#b3190f'), 'flame', 1),
    ('pk-tide-serpent', 'Tide Serpent', 'Water · Stage 1', ('#4fc3f7', '#0b4f8a'), 'drop', 2),
    ('pk-volt-fox', 'Volt Fox', 'Lightning · Basic', ('#ffe066', '#e0a800'), 'bolt', 3),
    ('pk-grove-titan', 'Grove Titan', 'Grass · Stage 2', ('#8bd46a', '#1f6b2a'), 'leaf', 4),
    ('pk-astral-wyrm', 'Astral Wyrm', 'Dragon · Secret', ('#c39bff', '#3a1a78'), 'star', 5),
]
OP = [
    ('op-straw-captain', 'Straw Captain', 'Leader · Red', ('#ff5a5a', '#8a0f1a'), 'anchor', 5),
    ('op-navigator', 'Storm Navigator', 'Character · Blue', ('#5ab0ff', '#0d3b73'), 'wheel', 3),
    ('op-swordsman', 'Triple Blade', 'Character · Green', ('#6fd38f', '#14542e'), 'star', 4),
    ('op-jolly-roger', 'Jolly Roger', 'Event · Black', ('#8f8f9f', '#1d1d27'), 'skull', 2),
    ('op-deck-hand', 'Deck Hand', 'Character · Yellow', ('#ffd84d', '#a87a00'), 'anchor', 1),
]

def save(img, name):
    img.save(os.path.join(OUT, name), 'JPEG', quality=86, optimize=True, progressive=True)

if __name__ == '__main__':
    faces = {}
    for handle, title, sub, cols, kind, stars in PK:
        faces[handle] = card(630, 880, title, sub, cols, kind, stars, foil=stars >= 3)
    for handle, title, sub, cols, kind, stars in OP:
        faces[handle] = card(630, 880, title, sub, cols, kind, stars, foil=stars >= 4, line='OP')
    for h, f in faces.items():
        save(product_shot(f), f'{h}.jpg')
        save(product_shot(f, stack=3, label='BULK PACK'), f'{h}-pack.jpg')

    # bulk lot packs by rarity
    lots = [
        ('pk-bulk-common-100', faces['pk-ember-drake'], 'COMMON x100'),
        ('pk-bulk-holo-25', faces['pk-volt-fox'], 'HOLO RARE x25'),
        ('pk-bulk-ultra-5', faces['pk-astral-wyrm'], 'ULTRA RARE x5'),
        ('op-bulk-common-100', faces['op-deck-hand'], 'COMMON x100'),
        ('op-bulk-rare-25', faces['op-navigator'], 'RARE x25'),
        ('op-bulk-sr-5', faces['op-swordsman'], 'SUPER RARE x5'),
    ]
    for h, f, lbl in lots:
        save(product_shot(f, stack=3, label=lbl), f'{h}.jpg')

    # ---------- theme demo assets ----------
    def fan(canvas, cards, cx, cy, cw, spread):
        n = len(cards)
        for i, c in enumerate(cards):
            ch = int(cw * 88 / 63)
            img = c.resize((cw, ch), Image.LANCZOS).convert('RGBa').rotate((i - (n - 1) / 2) * -spread, expand=True, resample=Image.BICUBIC).convert('RGBA')
            sh, sp = drop_shadow(img, 110, 24)
            x = cx - img.size[0] // 2 + int((i - (n - 1) / 2) * cw * .55)
            y = cy - img.size[1] // 2 + int(abs(i - (n - 1) / 2) * cw * .08)
            canvas.alpha_composite(sh, (x + 16 - sp, y + 24 - sp)); canvas.alpha_composite(img, (x, y))

    hero = gradient((2400, 1350), hexrgb('#1a1f4d'), hexrgb('#0b0d1a'), vertical=False).convert('RGBA')
    hd = ImageDraw.Draw(hero)
    for i in range(60):
        r = random.Random(i)
        x, y, s = r.randint(0, 2400), r.randint(0, 1350), r.randint(2, 6)
        hd.ellipse([x, y, x + s, y + s], fill=(255, 255, 255, 120))
    fan(hero, [faces['op-straw-captain'], faces['pk-ember-drake'], faces['pk-astral-wyrm'], faces['op-navigator'], faces['pk-volt-fox']], 1700, 690, 380, 12)
    save(hero.convert('RGB'), 'demo-hero.jpg')

    heroM = gradient((1080, 1350), hexrgb('#1a1f4d'), hexrgb('#0b0d1a')).convert('RGBA')
    fan(heroM, [faces['pk-ember-drake'], faces['pk-astral-wyrm'], faces['op-straw-captain']], 540, 470, 330, 14)
    save(heroM.convert('RGB'), 'demo-hero-mobile.jpg')

    def tile(cards, c1, c2, name):
        t = gradient((1000, 1000), hexrgb(c1), hexrgb(c2)).convert('RGBA')
        fan(t, cards, 500, 520, 330, 14)
        save(t.convert('RGB'), name)
    tile([faces['pk-tide-serpent'], faces['pk-ember-drake'], faces['pk-grove-titan']], '#ff8a65', '#c62828', 'demo-tile-pokemon.jpg')
    tile([faces['op-navigator'], faces['op-straw-captain'], faces['op-swordsman']], '#64b5f6', '#0b4f8a', 'demo-tile-onepiece.jpg')
    save(product_shot(faces['pk-volt-fox'], size=(1000, 1000), bg='#ffd54f', stack=3, label='WHOLESALE'), 'demo-tile-wholesale.jpg')
    t = gradient((1000, 1000), hexrgb('#e8eaf6'), hexrgb('#9fa8da')).convert('RGBA')
    td = ImageDraw.Draw(t)
    for i, (x, y) in enumerate([(120, 170), (300, 420), (480, 670)]):
        td.rounded_rectangle([x, y, x + 420, y + 190], 36, fill=(255, 255, 255, 235))
        for s in range(5):
            emblem(td, x + 60 + s * 52, y + 60, 20, 'star', (255, 193, 7))
        for l in range(2):
            td.line([(x + 40, y + 115 + l * 34), (x + 380 - l * 90, y + 115 + l * 34)], fill=(180, 180, 200), width=12)
    save(t.convert('RGB'), 'demo-tile-feedback.jpg')
    print('generated', len(os.listdir(OUT)), 'images')
