"""Builds demo-products.csv (Shopify product import format) for the TCG Vault demo store.
All products are fictional demo items tagged `demo` so they can be bulk-deleted before launch."""
import csv, os

BASE = 'https://raw.githubusercontent.com/vachnganclub/codex-chatgpt-web/claude/project-thread-hibvkw/shopify-theme/demo/images/'
HEADER = ['Handle', 'Title', 'Body (HTML)', 'Vendor', 'Type', 'Tags', 'Published', 'Option1 Name', 'Option1 Value',
          'Variant SKU', 'Variant Grams', 'Variant Inventory Tracker', 'Variant Inventory Qty', 'Variant Inventory Policy',
          'Variant Fulfillment Service', 'Variant Price', 'Variant Compare At Price', 'Variant Requires Shipping',
          'Variant Taxable', 'Image Src', 'Image Position', 'Image Alt Text', 'Variant Image', 'Variant Weight Unit', 'Status']

# handle, title, line, rarity tag, rarity label, card price, pack price, pack size, card qty, pack qty, compare-at for card
SINGLES = [
    ('pk-ember-drake', 'Ember Drake – Fire Basic', 'pokemon', 'common', 'Common', '0.50', '4.00', 10, 120, 12, ''),
    ('pk-tide-serpent', 'Tide Serpent – Water Stage 1', 'pokemon', 'uncommon', 'Uncommon', '1.20', '10.00', 10, 80, 8, ''),
    ('pk-volt-fox', 'Volt Fox – Lightning Holo', 'pokemon', 'holo-rare', 'Holo rare', '4.50', '40.00', 10, 25, 3, '5.50'),
    ('pk-grove-titan', 'Grove Titan – Grass Ultra Rare', 'pokemon', 'ultra-rare', 'Ultra rare', '18.00', '160.00', 10, 6, 0, ''),
    ('pk-astral-wyrm', 'Astral Wyrm – Dragon Secret Rare', 'pokemon', 'secret-rare', 'Secret rare', '65.00', '590.00', 10, 2, 1, '79.00'),
    ('op-deck-hand', 'Deck Hand – Yellow Character', 'one-piece', 'common', 'Common', '0.40', '3.50', 10, 150, 15, ''),
    ('op-jolly-roger', 'Jolly Roger – Black Event', 'one-piece', 'uncommon', 'Uncommon', '0.90', '8.00', 10, 90, 9, ''),
    ('op-navigator', 'Storm Navigator – Blue Character', 'one-piece', 'rare', 'Rare', '3.80', '34.00', 10, 30, 3, ''),
    ('op-swordsman', 'Triple Blade – Green Super Rare', 'one-piece', 'super-rare', 'Super rare', '22.00', '199.00', 10, 5, 0, '26.00'),
    ('op-straw-captain', 'Straw Captain – Red Leader', 'one-piece', 'leader', 'Leader', '12.00', '110.00', 10, 10, 2, ''),
]
# handle, title, line, rarity tag, rarity label, price, qty, contents
LOTS = [
    ('pk-bulk-common-100', 'Pokémon-style Bulk Pack – 100 Common Cards', 'pokemon', 'common', 'Common', '12.00', 40, '100 assorted common cards, no duplicates over 4 copies'),
    ('pk-bulk-holo-25', 'Pokémon-style Bulk Pack – 25 Holo Rares', 'pokemon', 'holo-rare', 'Holo rare', '45.00', 15, '25 assorted holo rare cards'),
    ('pk-bulk-ultra-5', 'Pokémon-style Bulk Pack – 5 Ultra Rares', 'pokemon', 'ultra-rare', 'Ultra rare', '70.00', 6, '5 assorted ultra rare cards'),
    ('op-bulk-common-100', 'One Piece-style Bulk Pack – 100 Common Cards', 'one-piece', 'common', 'Common', '11.00', 40, '100 assorted common cards'),
    ('op-bulk-rare-25', 'One Piece-style Bulk Pack – 25 Rares', 'one-piece', 'rare', 'Rare', '38.00', 15, '25 assorted rare cards'),
    ('op-bulk-sr-5', 'One Piece-style Bulk Pack – 5 Super Rares', 'one-piece', 'super-rare', 'Super rare', '85.00', 5, '5 assorted super rare cards'),
]

DEMO_NOTE = '<p><em>Demo product for previewing the store layout. Replace or delete before launch.</em></p>'

def row(**kw):
    r = {h: '' for h in HEADER}
    r.update(kw)
    return r

rows = []
for i, (h, title, line, rtag, rlabel, cp, pp, size, cq, pq, cmp) in enumerate(SINGLES, 1):
    game = 'Pokémon' if line == 'pokemon' else 'One Piece'
    body = (f'<p>{title} from <strong>Demo Set 01</strong>, card #{i:03d}. Condition: Near Mint. Language: English.</p>'
            f'<ul><li><strong>Card</strong>: one single copy, sleeved and shipped in a top loader.</li>'
            f'<li><strong>Pack</strong>: {size} copies of this card in a sealed bag, for players and resellers.</li></ul>'
            f'<p>Rarity: {rlabel}. Game line: {game}.</p>' + DEMO_NOTE)
    common = dict(Handle=h, Vendor='TCG Vault Demo', Type='Single card', Published='TRUE', Status='active',
                  **{'Variant Inventory Tracker': 'shopify', 'Variant Inventory Policy': 'deny', 'Variant Fulfillment Service': 'manual',
                     'Variant Requires Shipping': 'TRUE', 'Variant Taxable': 'TRUE', 'Variant Weight Unit': 'g'})
    tags = f'demo, {line}, unit:card, unit:pack, rarity:{rtag}'
    rows.append(row(**common, Title=title, **{'Body (HTML)': body, 'Tags': tags, 'Option1 Name': 'Purchase type', 'Option1 Value': 'card',
                    'Variant SKU': f'DEMO-{h.upper()}-C', 'Variant Grams': '20', 'Variant Inventory Qty': cq, 'Variant Price': cp,
                    'Variant Compare At Price': cmp, 'Image Src': BASE + f'{h}.jpg', 'Image Position': 1,
                    'Image Alt Text': f'{title} single card (demo artwork)', 'Variant Image': BASE + f'{h}.jpg'}))
    rows.append(row(Handle=h, **{'Option1 Value': 'pack', 'Variant SKU': f'DEMO-{h.upper()}-P', 'Variant Grams': '120',
                    'Variant Inventory Tracker': 'shopify', 'Variant Inventory Qty': pq, 'Variant Inventory Policy': 'deny',
                    'Variant Fulfillment Service': 'manual', 'Variant Price': pp, 'Variant Requires Shipping': 'TRUE',
                    'Variant Taxable': 'TRUE', 'Image Src': BASE + f'{h}-pack.jpg', 'Image Position': 2,
                    'Image Alt Text': f'{title} pack of {size} (demo artwork)', 'Variant Image': BASE + f'{h}-pack.jpg',
                    'Variant Weight Unit': 'g'}))

for h, title, line, rtag, rlabel, price, qty, contents in LOTS:
    game = 'Pokémon' if line == 'pokemon' else 'One Piece'
    body = (f'<p>{contents}. Sorted by rarity and packed in a sealed bag.</p>'
            f'<p>Rarity: {rlabel}. Game line: {game}. Condition: Near Mint to Lightly Played.</p>' + DEMO_NOTE)
    rows.append(row(Handle=h, Title=title, Vendor='TCG Vault Demo', Type='Bulk pack', Published='TRUE', Status='active',
                    **{'Body (HTML)': body, 'Tags': f'demo, {line}, unit:pack, rarity:{rtag}', 'Option1 Name': 'Purchase type',
                       'Option1 Value': 'pack', 'Variant SKU': f'DEMO-{h.upper()}', 'Variant Grams': '400',
                       'Variant Inventory Tracker': 'shopify', 'Variant Inventory Qty': qty, 'Variant Inventory Policy': 'deny',
                       'Variant Fulfillment Service': 'manual', 'Variant Price': price, 'Variant Requires Shipping': 'TRUE',
                       'Variant Taxable': 'TRUE', 'Image Src': BASE + f'{h}.jpg', 'Image Position': 1,
                       'Image Alt Text': f'{title} (demo artwork)', 'Variant Weight Unit': 'g'}))

out = os.path.join(os.path.dirname(__file__), 'demo-products.csv')
with open(out, 'w', newline='', encoding='utf-8') as f:
    w = csv.DictWriter(f, fieldnames=HEADER)
    w.writeheader(); w.writerows(rows)
print(len(rows), 'rows,', len(SINGLES) + len(LOTS), 'products')
