import json
import os
import hashlib
from pdf2image import convert_from_path
import pdfplumber
from PIL import Image

PDF_PATH = "/home/zerocreator/Downloads/Таблица цветная.pdf"
OUTPUT_DIR = "public/icons"
JSON_PATH = "src/data/tableData.json"

DPI = 300
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

SHEET_COLUMNS = {
    1: list(range(1, 7)),
    2: list(range(7, 13)),
    3: list(range(13, 19)),
}

PERIOD_BY_ROW = [1, 2, 3, 4, 5, 6, 7, '6a', '7a']


def cell_bbox(sheet, row_index, col_index):
    col = SHEET_COLUMNS[sheet][col_index]
    x0 = X_START + col_index * COL_WIDTH
    x1 = x0 + COL_WIDTH
    y0, y1 = ROW_BOUNDS[row_index]
    return (col, x0, y0, x1, y1)


def intersect_area(a, b):
    x0 = max(a[0], b[0])
    y0 = max(a[1], b[1])
    x1 = min(a[2], b[2])
    y1 = min(a[3], b[3])
    if x1 <= x0 or y1 <= y0:
        return 0
    return (x1 - x0) * (y1 - y0)


def best_cell_for_image(sheet, ix0, iy0, ix1, iy1):
    best = None
    best_area = 0
    for ri in range(len(ROW_BOUNDS)):
        for ci in range(len(SHEET_COLUMNS[sheet])):
            col, cx0, cy0, cx1, cy1 = cell_bbox(sheet, ri, ci)
            area = intersect_area((ix0, iy0, ix1, iy1), (cx0, cy0, cx1, cy1))
            if area > best_area:
                best_area = area
                best = (PERIOD_BY_ROW[ri], col)
    return best


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    with open(JSON_PATH, encoding='utf-8') as f:
        data = json.load(f)
    cells_by_pos = {(c['period'], c['column']): c for c in data['cells']}

    extracted = 0

    for sheet, page_index in [(1, 1), (2, 2), (3, 3)]:
        pdf_page_index = page_index + 1
        rendered = convert_from_path(
            PDF_PATH,
            first_page=pdf_page_index,
            last_page=pdf_page_index,
            dpi=DPI,
        )[0]
        scale = DPI / 72.0

        with pdfplumber.open(PDF_PATH) as pdf:
            page = pdf.pages[page_index]
            images = page.images

            for img in images:
                x0, y0, x1, y1 = img['x0'], img['top'], img['x1'], img['bottom']

                # Skip header images and row-header images
                if x0 < X_START or y1 < ROW_BOUNDS[0][0]:
                    continue

                pos = best_cell_for_image(sheet, x0, y0, x1, y1)
                if not pos:
                    continue

                cell = cells_by_pos.get(pos)
                if not cell:
                    continue

                pad = 2
                px0 = max(0, int((x0 - pad) * scale))
                py0 = max(0, int((y0 - pad) * scale))
                px1 = int((x1 + pad) * scale)
                py1 = int((y1 + pad) * scale)

                crop = rendered.crop((px0, py0, px1, py1))

                h = hashlib.md5(f"{x0},{y0},{x1},{y1}".encode()).hexdigest()[:6]
                filename = f"{pos[0]}-{pos[1]}-{h}.png"
                filepath = os.path.join(OUTPUT_DIR, filename)
                crop.save(filepath, 'PNG')

                cell.setdefault('icons', [])
                relative = '/icons/' + filename
                if relative not in cell['icons']:
                    cell['icons'].append(relative)
                extracted += 1

    # Move the worm/leech/lamprey/actinia icons from the duplicate La cell (6,3)
    # on sheet 1 to the Yttrium cell (5,3), as the user requested.
    la_dup = cells_by_pos.get((6, 3))
    y_cell = cells_by_pos.get((5, 3))
    if la_dup and y_cell and la_dup.get('icons'):
        y_cell.setdefault('icons', [])
        for icon in la_dup['icons']:
            if icon not in y_cell['icons']:
                y_cell['icons'].append(icon)
        del la_dup['icons']

    with open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f'Extracted {extracted} icons into {OUTPUT_DIR}')


if __name__ == '__main__':
    main()
