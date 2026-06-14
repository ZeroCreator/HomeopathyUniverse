import pdfplumber
import json
import re

PDF_PATH = "/home/zerocreator/Downloads/Таблица цветная.pdf"

SHEET_CONFIG = {
    1: {"columns": list(range(1, 7))},
    2: {"columns": list(range(7, 13))},
    3: {"columns": list(range(13, 19))},
}

X_START = 160
COL_WIDTH = 72

ROW_BOUNDS = [
    (140, 184),
    (184, 256),
    (256, 328),
    (328, 399),
    (399, 471),
    (471, 542),
    (542, 614),
    (614, 685),
    (685, 757),
]

ROWS = [
    {"id": 1, "title": "Вселенная", "subtitle": "Ряд Водорода", "miasm": "Острый миазм", "creationDay": "1", "description": "Первый ряд. Водород. Начало, идея, мечта, энтропия."},
    {"id": 2, "title": "Пространство", "subtitle": "Ряд Углерода", "miasm": "Сикотический миазм", "creationDay": "2", "description": "Второй ряд. Углерод. Пространство, любовь, познание, биполярность."},
    {"id": 3, "title": "Море, суша, бактерии, грибы, растения", "subtitle": "Ряд Кремния", "miasm": "Псорический миазм", "creationDay": "3", "description": "Третий ряд. Кремний. Море и суша, растения, вирусы и бактерии."},
    {"id": 4, "title": "Время", "subtitle": "Ряд Железа", "miasm": "Сифилитический миазм", "creationDay": "4", "description": "Четвёртый ряд. Железо. Время, работа, смена, сифилитический миазм."},
    {"id": 5, "title": "Животные водные, птицы, насекомые", "subtitle": "Ряд Серебра", "miasm": "Туберкулиновый миазм", "creationDay": "5", "description": "Пятый ряд. Серебро. Водные животные, птицы, насекомые."},
    {"id": 6, "title": "Животные млекопитающие, наземные, человек", "subtitle": "Ряд Золота", "miasm": "Раковый миазм", "creationDay": "6", "description": "Шестой ряд. Золото. Млекопитающие, человек, раковый миазм."},
    {"id": 7, "title": "Добро и зло", "subtitle": "Ряд Урана", "miasm": "Лепрозный миазм", "creationDay": "7", "description": "Седьмой ряд. Уран. Добро и зло, метафизика, лепрозный миазм."},
    {"id": "6a", "title": "Лантаноиды", "subtitle": "", "miasm": "", "creationDay": "", "description": "Лантаноиды. Внутреннее воодушевление, сакральный момент."},
    {"id": "7a", "title": "Актиноиды", "subtitle": "", "miasm": "", "creationDay": "", "description": "Актиноиды. Проекция, путь, радиоактивность."},
]

COLUMNS = [
    {"id": 1, "topTitle": "Проект", "title": "Идея", "subtitle": "Колонка 1", "description": "Начало, замысел, проект, личная история."},
    {"id": 2, "topTitle": "Внутри", "title": "Тайна", "subtitle": "Колонка 2", "description": "Скрытое, непроявленное, проникновение, связи с миром."},
    {"id": 3, "topTitle": "Молоко", "title": "Смятение", "subtitle": "Колонка 3", "description": "Смятение, кормление, молоко, опиоидность."},
    {"id": 4, "topTitle": "Зубы", "title": "Опора", "subtitle": "Колонка 4", "description": "Опора, зубы, кости, агрессия, взросление."},
    {"id": 5, "topTitle": "Выделение(я)", "title": "Отделиться", "subtitle": "Колонка 5", "description": "Отделение, выделения, отграничение от целого."},
    {"id": 6, "topTitle": "Голос", "title": "Договориться", "subtitle": "Колонка 6", "description": "Голос, социальное взаимодействие, коммуникация."},
    {"id": 7, "topTitle": "СЕМьЯ", "title": "Исступление", "subtitle": "Колонка 7", "description": "Исступление, сверхсила, искушение, соперничество."},
    {"id": 8, "topTitle": "Из Мена", "title": "Застревание", "subtitle": "Колонка 8", "description": "Застревание, роботы, вариантность отношений."},
    {"id": 9, "topTitle": "Из Вкушения", "title": "Грехопадение", "subtitle": "Колонка 9", "description": "Грехопадение, власть, зомбирование, рабство."},
    {"id": 10, "topTitle": "Крест", "title": "Изгнание из Рая", "subtitle": "Колонка 10", "description": "Изгнание, осознание смертности, амбиции."},
    {"id": 11, "topTitle": "Зеркало", "title": "Каин и Авель", "subtitle": "Колонка 11", "description": "Каин и Авель, жертвоприношение, идолопоклонство."},
    {"id": 12, "topTitle": "Трое", "title": "Сын. Подросток", "subtitle": "Колонка 12", "description": "Сын, подросток, духовные искания, творчество."},
    {"id": 13, "topTitle": "Мать-земля", "title": "Мать-земля", "subtitle": "Колонка 13", "description": "Мать-земля, материнство, женщина, дети."},
    {"id": 14, "topTitle": "СтолпоВтворение", "title": "Столпотворение", "subtitle": "Колонка 14", "description": "Столпотворение, форма, санитар общества."},
    {"id": 15, "topTitle": "СверхРеализм", "title": "СверхРеализм", "subtitle": "Колонка 15", "description": "Сверхреализм, чудо, добро и зло."},
    {"id": 16, "topTitle": "Самосознание", "title": "Самосознание", "subtitle": "Колонка 16", "description": "Самосознание, миссия, наука, прогресс."},
    {"id": 17, "topTitle": "Рождение", "title": "Рождение", "subtitle": "Колонка 17", "description": "Рождение, любовь, принятие судьбы."},
    {"id": 18, "topTitle": "Покаяние", "title": "Покаяние", "subtitle": "Колонка 18", "description": "Покаяние, дорога к храму, инициация."},
]

ELEMENT_INFO = {
    'H':  {'number': 1,    'mass': '1,008',   'category': 'nonmetal'},
    'He': {'number': 2,    'mass': '4,0026',  'category': 'noble'},
    'Li': {'number': 3,    'mass': '6,94',    'category': 'alkali'},
    'Be': {'number': 4,    'mass': '9,0122',  'category': 'alkaline'},
    'B':  {'number': 5,    'mass': '10,81',   'category': 'metalloid'},
    'C':  {'number': 6,    'mass': '12,011',  'category': 'nonmetal'},
    'N':  {'number': 7,    'mass': '14,007',  'category': 'nonmetal'},
    'O':  {'number': 8,    'mass': '15,999',  'category': 'nonmetal'},
    'F':  {'number': 9,    'mass': '18,998',  'category': 'nonmetal'},
    'Ne': {'number': 10,   'mass': '20,180',  'category': 'noble'},
    'Na': {'number': 11,   'mass': '22,990',  'category': 'alkali'},
    'Mg': {'number': 12,   'mass': '24,305',  'category': 'alkaline'},
    'Al': {'number': 13,   'mass': '26,982',  'category': 'poor'},
    'Si': {'number': 14,   'mass': '28,085',  'category': 'metalloid'},
    'P':  {'number': 15,   'mass': '30,974',  'category': 'nonmetal'},
    'S':  {'number': 16,   'mass': '32,06',   'category': 'nonmetal'},
    'Cl': {'number': 17,   'mass': '35,45',   'category': 'nonmetal'},
    'Ar': {'number': 18,   'mass': '39,948',  'category': 'noble'},
    'K':  {'number': 19,   'mass': '39,098',  'category': 'alkali'},
    'Ca': {'number': 20,   'mass': '40,078',  'category': 'alkaline'},
    'Sc': {'number': 21,   'mass': '44,956',  'category': 'transition'},
    'Ti': {'number': 22,   'mass': '47,867',  'category': 'transition'},
    'V':  {'number': 23,   'mass': '50,942',  'category': 'transition'},
    'Cr': {'number': 24,   'mass': '51,996',  'category': 'transition'},
    'Mn': {'number': 25,   'mass': '54,938',  'category': 'transition'},
    'Fe': {'number': 26,   'mass': '55,845',  'category': 'transition'},
    'Co': {'number': 27,   'mass': '58,933',  'category': 'transition'},
    'Ni': {'number': 28,   'mass': '58,693',  'category': 'transition'},
    'Cu': {'number': 29,   'mass': '63,546',  'category': 'transition'},
    'Zn': {'number': 30,   'mass': '65,38',   'category': 'transition'},
    'Ga': {'number': 31,   'mass': '69,723',  'category': 'poor'},
    'Ge': {'number': 32,   'mass': '72,63',   'category': 'metalloid'},
    'As': {'number': 33,   'mass': '74,922',  'category': 'metalloid'},
    'Se': {'number': 34,   'mass': '78,96',   'category': 'nonmetal'},
    'Br': {'number': 35,   'mass': '79,904',  'category': 'nonmetal'},
    'Kr': {'number': 36,   'mass': '83,798',  'category': 'noble'},
    'Rb': {'number': 37,   'mass': '85,468',  'category': 'alkali'},
    'Sr': {'number': 38,   'mass': '87,62',   'category': 'alkaline'},
    'Y':  {'number': 39,   'mass': '88,906',  'category': 'transition'},
    'Zr': {'number': 40,   'mass': '91,224',  'category': 'transition'},
    'Nb': {'number': 41,   'mass': '92,906',  'category': 'transition'},
    'Mo': {'number': 42,   'mass': '95,95',   'category': 'transition'},
    'Tc': {'number': 43,   'mass': '98',      'category': 'transition'},
    'Ru': {'number': 44,   'mass': '101,07',  'category': 'transition'},
    'Rh': {'number': 45,   'mass': '102,91',  'category': 'transition'},
    'Pd': {'number': 46,   'mass': '106,42',  'category': 'transition'},
    'Ag': {'number': 47,   'mass': '107,87',  'category': 'transition'},
    'Cd': {'number': 48,   'mass': '112,41',  'category': 'transition'},
    'In': {'number': 49,   'mass': '114,82',  'category': 'poor'},
    'Sn': {'number': 50,   'mass': '118,71',  'category': 'poor'},
    'Sb': {'number': 51,   'mass': '121,76',  'category': 'metalloid'},
    'Te': {'number': 52,   'mass': '127,60',  'category': 'metalloid'},
    'I':  {'number': 53,   'mass': '126,90',  'category': 'nonmetal'},
    'Xe': {'number': 54,   'mass': '131,29',  'category': 'noble'},
    'Cs': {'number': 55,   'mass': '132,91',  'category': 'alkali'},
    'Ba': {'number': 56,   'mass': '137,33',  'category': 'alkaline'},
    'La': {'number': 57,   'mass': '138,91',  'category': 'lanthanoid'},
    'Ce': {'number': 58,   'mass': '140,12',  'category': 'lanthanoid'},
    'Pr': {'number': 59,   'mass': '140,91',  'category': 'lanthanoid'},
    'Nd': {'number': 60,   'mass': '144,24',  'category': 'lanthanoid'},
    'Pm': {'number': 61,   'mass': '145',     'category': 'lanthanoid'},
    'Sm': {'number': 62,   'mass': '150,36',  'category': 'lanthanoid'},
    'Eu': {'number': 63,   'mass': '151,96',  'category': 'lanthanoid'},
    'Gd': {'number': 64,   'mass': '157,25',  'category': 'lanthanoid'},
    'Tb': {'number': 65,   'mass': '158,93',  'category': 'lanthanoid'},
    'Dy': {'number': 66,   'mass': '162,50',  'category': 'lanthanoid'},
    'Ho': {'number': 67,   'mass': '164,93',  'category': 'lanthanoid'},
    'Er': {'number': 68,   'mass': '167,26',  'category': 'lanthanoid'},
    'Tm': {'number': 69,   'mass': '168,93',  'category': 'lanthanoid'},
    'Yb': {'number': 70,   'mass': '173,05',  'category': 'lanthanoid'},
    'Lu': {'number': 71,   'mass': '174,97',  'category': 'lanthanoid'},
    'Hf': {'number': 72,   'mass': '178,49',  'category': 'transition'},
    'Ta': {'number': 73,   'mass': '180,95',  'category': 'transition'},
    'W':  {'number': 74,   'mass': '183,84',  'category': 'transition'},
    'Re': {'number': 75,   'mass': '186,21',  'category': 'transition'},
    'Os': {'number': 76,   'mass': '190,23',  'category': 'transition'},
    'Ir': {'number': 77,   'mass': '192,22',  'category': 'transition'},
    'Pt': {'number': 78,   'mass': '195,08',  'category': 'transition'},
    'Au': {'number': 79,   'mass': '196,97',  'category': 'transition'},
    'Hg': {'number': 80,   'mass': '200,59',  'category': 'transition'},
    'Tl': {'number': 81,   'mass': '204,38',  'category': 'poor'},
    'Pb': {'number': 82,   'mass': '207,2',   'category': 'poor'},
    'Bi': {'number': 83,   'mass': '208,98',  'category': 'poor'},
    'Po': {'number': 84,   'mass': '209',     'category': 'metalloid'},
    'At': {'number': 85,   'mass': '210',     'category': 'nonmetal'},
    'Rn': {'number': 86,   'mass': '222',     'category': 'noble'},
    'Fr': {'number': 87,   'mass': '223',     'category': 'alkali'},
    'Ra': {'number': 88,   'mass': '226',     'category': 'alkaline'},
    'Ac': {'number': 89,   'mass': '227',     'category': 'actinoid'},
    'Th': {'number': 90,   'mass': '232,04',  'category': 'actinoid'},
    'Pa': {'number': 91,   'mass': '231,04',  'category': 'actinoid'},
    'U':  {'number': 92,   'mass': '238,03',  'category': 'actinoid'},
    'Np': {'number': 93,   'mass': '237',     'category': 'actinoid'},
    'Pu': {'number': 94,   'mass': '244',     'category': 'actinoid'},
    'Am': {'number': 95,   'mass': '243',     'category': 'actinoid'},
    'Cm': {'number': 96,   'mass': '247',     'category': 'actinoid'},
    'Bk': {'number': 97,   'mass': '247',     'category': 'actinoid'},
    'Cf': {'number': 98,   'mass': '251',     'category': 'actinoid'},
    'Es': {'number': 99,   'mass': '252',     'category': 'actinoid'},
    'Fm': {'number': 100,  'mass': '257',     'category': 'actinoid'},
    'Md': {'number': 101,  'mass': '258',     'category': 'actinoid'},
    'No': {'number': 102,  'mass': '259',     'category': 'actinoid'},
    'Lr': {'number': 103,  'mass': '262',     'category': 'actinoid'},
    'Rf': {'number': 104,  'mass': '267',     'category': 'transition'},
    'Db': {'number': 105,  'mass': '270',     'category': 'transition'},
    'Sg': {'number': 106,  'mass': '271',     'category': 'transition'},
    'Bh': {'number': 107,  'mass': '270',     'category': 'transition'},
    'Hs': {'number': 108,  'mass': '277',     'category': 'transition'},
    'Mt': {'number': 109,  'mass': '276',     'category': 'transition'},
    'Ds': {'number': 110,  'mass': '281',     'category': 'transition'},
    'Rg': {'number': 111,  'mass': '280',     'category': 'transition'},
    'Cn': {'number': 112,  'mass': '285',     'category': 'transition'},
    'Nh': {'number': 113,  'mass': '284',     'category': 'poor'},
    'Fl': {'number': 114,  'mass': '289',     'category': 'poor'},
    'Mc': {'number': 115,  'mass': '288',     'category': 'poor'},
    'Lv': {'number': 116,  'mass': '293',     'category': 'poor'},
    'Ts': {'number': 117,  'mass': '294',     'category': 'nonmetal'},
    'Og': {'number': 118,  'mass': '294',     'category': 'noble'},
}

ELEMENT_SYMBOLS = set(ELEMENT_INFO.keys())

CYRILLIC_TO_LATIN = {
    'Н': 'H', 'С': 'C', 'О': 'O', 'Р': 'P', 'В': 'B', 'К': 'K',
    'Т': 'T', 'М': 'M', 'Е': 'E', 'А': 'A', 'Х': 'X'
}


def normalize_symbol(sym: str) -> str:
    return ''.join(CYRILLIC_TO_LATIN.get(ch, ch) for ch in sym)


def extract_cell(page, x0, y0, x1, y1):
    text = page.within_bbox((x0, y0, x1, y1)).extract_text()
    if not text:
        return []
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    return lines


def parse_element_header(lines):
    if not lines:
        return None
    for line in lines[:4]:
        match = re.match(r"^(\d+)?\s*([A-Za-zА-Яа-я][a-zа-я]?)\s*(.+)$", line)
        if match:
            symbol = normalize_symbol(match.group(2))
            if symbol in ELEMENT_SYMBOLS:
                number = int(match.group(1)) if match.group(1) else None
                name = match.group(3).strip()
                if symbol == 'Md' and name.startswith('Менделев'):
                    name = 'Менделевий'
                if symbol == 'Ds' and name.startswith('Дармштадти'):
                    name = 'Дармштадтий'
                if symbol == 'Rg' and name.startswith('Рентгени'):
                    name = 'Рентгений'
                if symbol == 'Pm' and name.startswith('Промети'):
                    name = 'Прометий'
                if symbol == 'Pa' and name.startswith('Проактин'):
                    name = 'Проактиний'
                return {"number": number, "symbol": symbol, "name": name}
    return None


def main():
    cells = []
    with pdfplumber.open(PDF_PATH) as pdf:
        for page_idx, cfg in SHEET_CONFIG.items():
            page = pdf.pages[page_idx]
            cols = list(cfg["columns"])
            for ri, row in enumerate(ROWS):
                y0, y1 = ROW_BOUNDS[ri]
                for ci, col in enumerate(cols):
                    x0 = X_START + ci * COL_WIDTH
                    x1 = x0 + COL_WIDTH
                    lines = extract_cell(page, x0, y0, x1, y1)
                    if not lines:
                        continue
                    header = parse_element_header(lines)
                    symbol = header["symbol"] if header else None
                    properties = lines[1:] if header else lines
                    # Remove duplicate symbol-name lines from properties
                    if symbol and header:
                        clean_props = []
                        name = header["name"]
                        for prop in properties:
                            if prop.startswith(f"{symbol} {name}") or prop.startswith(name):
                                continue
                            clean_props.append(prop)
                        properties = clean_props
                    info = ELEMENT_INFO.get(symbol, {}) if symbol else {}
                    # text = full cell content; properties = short preview (max 5 lines)
                    if symbol:
                        full_text = lines
                        preview = properties
                    else:
                        full_text = lines
                        preview = lines[:5]
                    cells.append({
                        "period": row["id"],
                        "column": col,
                        "atomicNumber": info.get("number") or (header["number"] if header else None),
                        "symbol": symbol,
                        "name": header["name"] if header else None,
                        "atomicMass": info.get("mass"),
                        "category": info.get("category"),
                        "text": full_text,
                        "properties": preview,
                        "plants": [],
                        "animals": [],
                    })

    data = {
        "columns": COLUMNS,
        "rows": ROWS,
        "cells": cells,
    }

    with open("/tmp/table_data.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Extracted {len(cells)} cells")


if __name__ == "__main__":
    main()
