import json
import re
import os

# Parse ptable.com Russian HTML for element metadata by symbol
html_path = '/tmp/ptable_ru.html'
if not os.path.exists(html_path):
    raise FileNotFoundError(f'Download https://ptable.com/?lang=ru to {html_path} first')

html = open(html_path, encoding='utf-8').read()
items = re.findall(
    r'<li class="([^"]+)"[^>]*>\s*<b>(\d+)</b>\s*<abbr>([^<]+)</abbr>\s*<em>([^<]+)</em>\s*<data[^>]*>([^<]+)</data>\s*</li>',
    html
)

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

ptable_by_symbol = {}
for cls, num, sym, name, mass in items:
    cat = CATEGORY_MAP.get(cls.split()[0], 'nocategory')
    ptable_by_symbol[sym] = {
        'symbol': sym,
        'atomicNumber': int(num),
        'name': name,
        'atomicMass': mass.replace(',', '.'),
        'category': cat,
    }

with open('src/data/tableData.json', encoding='utf-8') as f:
    data = json.load(f)

cells_by_pos = {(c['period'], c['column']): c for c in data['cells']}

# Update metadata for every cell that has a symbol (including duplicates)
for cell in data['cells']:
    sym = cell.get('symbol')
    if sym and sym in ptable_by_symbol:
        cell.update(ptable_by_symbol[sym])

# Fix Pa cell at (7a, 5): the original PDF uses a Cyrillic 'а' in "Pа" so
# extract_all.py missed it. Assign the correct symbol and name.
pa_cell = cells_by_pos.get(('7a', 5))
if pa_cell:
    pa_cell.update(ptable_by_symbol['Pa'])
    # Fix misspelled name in text/properties
    for key in ['text', 'properties']:
        if key in pa_cell:
            pa_cell[key] = ['Протактиний' if 'Проактиний' in line else line for line in pa_cell[key]]

# Move the "Кольчат.черви", "Пиявки.Миног", "Актинии" records from the duplicate
# La cell (6,3) to Yttrium (5,3), as requested.
y_cell = cells_by_pos.get((5, 3))
la_dup = cells_by_pos.get((6, 3))
if y_cell and la_dup:
    y_cell.setdefault('animals', [])
    y_cell.setdefault('properties', [])
    y_cell.setdefault('text', [])
    for rec in ['Кольчат.черви', 'Пиявки.Миног', 'Актинии']:
        if rec in la_dup.get('properties', []):
            if rec not in y_cell['animals']:
                y_cell['animals'].append(rec)
            if rec not in y_cell['properties']:
                y_cell['properties'].append(rec)
            la_dup['properties'].remove(rec)
        if rec in la_dup.get('text', []):
            if rec not in y_cell['text']:
                y_cell['text'].append(rec)
            la_dup['text'].remove(rec)

# Remove duplicate element-name lines from text/properties
for cell in data['cells']:
    sym = cell.get('symbol')
    name = cell.get('name')
    if sym and name:
        needle = f"{sym} {name}"
        for key in ['text', 'properties']:
            if key in cell:
                cell[key] = [line for line in cell[key] if line != needle and line != name]

# Add placeholder cells for the lanthanoid/actinoid gaps, like on ptable.com:
# after Barium (period 6, column 3) and after Radium (period 7, column 3).
PLACEHOLDERS = [
    ((6, 3), 'lanthanoid', '57-71', 'Лантаноиды'),
    ((7, 3), 'actinoid', '89-103', 'Актиноиды'),
]
for pos, cat, numbers, title in PLACEHOLDERS:
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
        'symbol': None,
        'name': title,
        'atomicNumber': None,
        'atomicMass': None,
        'category': cat,
    })
    cell['text'] = [numbers, title]
    cell['properties'] = [numbers, title]

with open('src/data/tableData.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('Updated metadata for', sum(1 for c in data['cells'] if c.get('symbol')), 'element cells')
