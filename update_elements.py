import json
import re
import os

# Parse Ptable Russian HTML for element names, symbols, atomic numbers, masses, and categories.
html_path = '/tmp/ptable_ru.html'
if not os.path.exists(html_path):
    raise FileNotFoundError(f'Download https://ptable.com/?lang=ru to {html_path} first')

html = open(html_path, encoding='utf-8').read()
items = re.findall(
    r'<li class="([^"]+)"[^>]*>\s*<b>(\d+)</b>\s*<abbr>([^<]+)</abbr>\s*<em>([^<]+)</em>\s*<data[^>]*>([^<]+)</data>\s*</li>',
    html
)

# Build ordered list of element metadata from ptable.com
ptable_elements = []
for cls, num, sym, name, mass in items:
    category = cls.split()[0]
    ptable_elements.append({
        'atomicNumber': int(num),
        'symbol': sym,
        'name': name,
        'atomicMass': mass.replace(',', '.'),
        'category': category,
    })

# Map ptable category names to our internal categories
CATEGORY_MAP = {
    'Alkali': 'alkali',
    'Alkaline': 'alkaline',
    'Transition': 'transition',
    'Poor': 'poor',
    'Metalloid': 'metalloid',
    'Nonmetal': 'nonmetal',
    'Noble': 'noble',
    'Lanthanoid': 'lanthanoid',
    'Actinoid': 'actinoid',
}

# Assign standard periodic-table grid positions in our layout (periods 1-7 plus 6a/7a).
# The ptable HTML renders lanthanoids and actinoids inline in periods 6 and 7;
# our layout moves them to separate 6a/7a rows, so we reorder positions to match
# the ptable element order.
positions = []
# Period 1
positions.append((1, 1)); positions.append((1, 18))
# Period 2
for col in [1, 2]: positions.append((2, col))
for col in range(13, 19): positions.append((2, col))
# Period 3
for col in [1, 2]: positions.append((3, col))
for col in range(13, 19): positions.append((3, col))
# Period 4
for col in range(1, 19): positions.append((4, col))
# Period 5
for col in range(1, 19): positions.append((5, col))
# Period 6 + 6a: Cs, Ba, then La-Lu (6a row), then Hf-Rn (main row)
positions.append((6, 1)); positions.append((6, 2))
for col in range(3, 18): positions.append(('6a', col))
for col in range(4, 19): positions.append((6, col))
# Period 7 + 7a: Fr, Ra, then Ac-Lr (7a row), then Rf-Og (main row)
positions.append((7, 1)); positions.append((7, 2))
for col in range(3, 18): positions.append(('7a', col))
for col in range(4, 19): positions.append((7, col))

if len(positions) != len(ptable_elements):
    raise ValueError(f'Position count {len(positions)} does not match element count {len(ptable_elements)}')

ptable_by_pos = {}
ptable_by_symbol = {}
for pos, el in zip(positions, ptable_elements):
    el = dict(el)
    el['category'] = CATEGORY_MAP.get(el['category'], 'nocategory')
    ptable_by_pos[pos] = el
    ptable_by_symbol[el['symbol']] = el

# Load current data
with open('src/data/tableData.json', encoding='utf-8') as f:
    data = json.load(f)

# Remove element metadata from cells that are not in the correct position
correct_symbols_by_pos = {pos: el['symbol'] for pos, el in ptable_by_pos.items()}
for cell in data['cells']:
    if cell.get('symbol'):
        pos = (cell['period'], cell['column'])
        if correct_symbols_by_pos.get(pos) != cell['symbol']:
            # This cell incorrectly borrowed an element symbol; strip it
            for key in ['symbol', 'name', 'atomicNumber', 'atomicMass', 'category']:
                cell.pop(key, None)

# Build lookup by position for existing cells
cells_by_pos = {(c['period'], c['column']): c for c in data['cells']}

# Update/add all correct element cells
for pos, el in ptable_by_pos.items():
    cell = cells_by_pos.get(pos)
    if cell is None:
        cell = {
            'period': pos[0],
            'column': pos[1],
            'text': [],
            'properties': [],
            'plants': [],
            'animals': [],
        }
        data['cells'].append(cell)
        cells_by_pos[pos] = cell
    cell.update({
        'symbol': el['symbol'],
        'name': el['name'],
        'atomicNumber': el['atomicNumber'],
        'atomicMass': el['atomicMass'],
        'category': el['category'],
    })

# Move the "Кольчат.черви", "Пиявки.Миног", "Актинии" records to Yttrium (Y)
y_pos = (5, 3)
y_cell = cells_by_pos.get(y_pos)
if y_cell:
    y_cell.setdefault('animals', [])
    y_cell.setdefault('properties', [])
    for source_pos in [(6, 3)]:
        source = cells_by_pos.get(source_pos)
        if not source:
            continue
        for rec in ['Кольчат.черви', 'Пиявки.Миног', 'Актинии']:
            if rec in source.get('properties', []):
                if rec not in y_cell['animals']:
                    y_cell['animals'].append(rec)
                if rec not in y_cell['properties']:
                    y_cell['properties'].append(rec)
                source['properties'].remove(rec)
            if rec in source.get('text', []):
                source['text'].remove(rec)
        if (not source.get('properties') and not source.get('text') and not source.get('plants')
                and not source.get('animals') and not source.get('symbol')):
            data['cells'].remove(source)
            del cells_by_pos[source_pos]

# Sort cells by period then column for stable output
def sort_key(c):
    p = c['period']
    # numeric periods first, then '6a', '7a'
    return (str(p), c['column'])

data['cells'].sort(key=sort_key)

# Remove any remaining duplicate element-name lines from text/properties
for cell in data['cells']:
    sym = cell.get('symbol')
    name = cell.get('name')
    if sym and name:
        needle = f"{sym} {name}"
        for key in ['text', 'properties']:
            if key in cell:
                cell[key] = [line for line in cell[key] if line != needle and line != name]

with open('src/data/tableData.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('Updated', len(data['cells']), 'cells')
print('Added Protactinium at (7a,5):', cells_by_pos.get(('7a', 5), {}).get('name'))

# Validation: report any remaining misplaced symbols
with open('src/data/tableData.json', encoding='utf-8') as f:
    data = json.load(f)
misplaced = []
for c in data['cells']:
    if c.get('symbol'):
        pos = (c['period'], c['column'])
        if correct_symbols_by_pos.get(pos) != c['symbol']:
            misplaced.append((pos, c['symbol'], correct_symbols_by_pos.get(pos)))
print('Misplaced symbols:', misplaced)
