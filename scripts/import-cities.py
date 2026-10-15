"""Build the browser catalog from the official GV-ISys annual workbook.

Usage: python scripts/import-cities.py path/to/31122025_Auszug_GV.xlsx
openpyxl is only needed to refresh the catalog, never by the website.
"""
import json
import re
import sys
from collections import Counter
from pathlib import Path
import openpyxl

STATES = ['Schleswig-Holstein', 'Hamburg', 'Niedersachsen', 'Bremen', 'Nordrhein-Westfalen', 'Hessen', 'Rheinland-Pfalz', 'Baden-Württemberg', 'Bayern', 'Saarland', 'Berlin', 'Brandenburg', 'Mecklenburg-Vorpommern', 'Sachsen', 'Sachsen-Anhalt', 'Thüringen']
SOURCE = 'https://www.destatis.de/DE/Themen/Laender-Regionen/Regionales/Gemeindeverzeichnis/Administrativ/Archiv/GVAuszugJ/31122025_Auszug_GV.xlsx?__blob=publicationFile&v=2'
workbook = openpyxl.load_workbook(sys.argv[1], read_only=True, data_only=True)
sheet = workbook.worksheets[1]
rows = list(sheet.values)
assert '31.12.2025' in rows[0][0], 'Unexpected reference date. Review before importing.'
records = []
for row in rows:
    # Satzart 60 = municipality. 61/62/63/67 denote the city classes in this file.
    if row[0] != '60' or row[1] not in {'61', '62', '63', '67'}:
        continue
    population = row[9]
    if not isinstance(population, (int, float)) or population <= 30000:
        continue
    official = row[7]
    name = official.split(',', 1)[0].strip()
    aliases = []
    ascii_name = name.replace('ä', 'ae').replace('ö', 'oe').replace('ü', 'ue').replace('Ä', 'Ae').replace('Ö', 'Oe').replace('Ü', 'Ue').replace('ß', 'ss')
    if ascii_name != name:
        aliases.append(ascii_name)
    short = re.sub(r'\s*\([^)]*\)', '', name).strip()
    if short != name:
        aliases.append(short)
    extras = {'München': ['Munich'], 'Köln': ['Cologne'], 'Nürnberg': ['Nuremberg'], 'Frankfurt am Main': ['Frankfurt', 'Frankfurt Main'], 'Frankfurt (Oder)': ['Frankfurt Oder'], 'Ludwigshafen am Rhein': ['Ludwigshafen'], 'Freiburg im Breisgau': ['Freiburg'], 'Halle (Saale)': ['Halle Saale'], 'Offenbach am Main': ['Offenbach'], 'Mülheim an der Ruhr': ['Mülheim Ruhr'], 'Neustadt an der Weinstraße': ['Neustadt Weinstraße']}
    aliases.extend(extras.get(name, []))
    records.append({'name': name, 'officialName': official, 'aliases': list(dict.fromkeys(aliases)), 'category': 'city', 'group': 'city', 'population': int(population), 'state': STATES[int(row[2]) - 1], 'postalCode': str(row[13]), 'ags': ''.join(str(row[i]) for i in [2, 3, 4, 6])})
def stem(name):
    return re.split(r'\s+(?:am |an der |an dem |im |in der |v\. |vor der |i\.|a\.)', name, maxsplit=1)[0].strip()
stem_counts = Counter(stem(city['name']) for city in records)
for city in records:
    short = stem(city['name'])
    if short != city['name'] and stem_counts[short] == 1:
        city['aliases'].append(short)
    city['aliases'].append(city['name'] + ' ' + city['state'])
    if city['name'] == 'Neumarkt i.d.OPf.':
        city['aliases'].append('Neumarkt in der Oberpfalz')
    if city['name'] == 'Bad Homburg v. d. Höhe':
        city['aliases'].append('Bad Homburg vor der Höhe')
    city['aliases'] = list(dict.fromkeys(city['aliases']))
records.sort(key=lambda city: (-city['population'], city['name']))
assert len(records) == 396, f'Unexpected city count: {len(records)}. Review source changes.'
assert len({r['ags'] for r in records}) == len(records)
target = Path(__file__).resolve().parents[1] / 'cities.js'
metadata = {'publisher': 'Statistisches Bundesamt (Destatis), GV-ISys', 'referenceDate': '2025-12-31', 'threshold': 30000, 'comparison': 'strictly greater than', 'source': SOURCE, 'cityClasses': ['61', '62', '63', '67']}
target.write_text('// Amtlicher Katalog, lokal eingebunden. Die Suchergebnisse selbst sind erfunden.\nexport const citySource = ' + json.dumps(metadata, ensure_ascii=False, indent=2) + ';\n\nexport const cities = ' + json.dumps(records, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
print(f'{len(records)} cities above 30,000 residents imported; reference date 2025-12-31.')
