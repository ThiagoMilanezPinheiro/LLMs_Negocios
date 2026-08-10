from pathlib import Path
from src.main import buscar_dados_usgs
import json


def infer_region(row):
    lat = row['latitude']
    lon = row['longitude']
    if lon < -30 and lat < 15 and lat > -60:
        return 'América do Sul'
    if lat > 20 and lon > 100:
        return 'Ásia'
    if lat > 35 and -10 <= lon <= 40:
        return 'Europa'
    if lat > 20 and lon < -90:
        return 'América do Norte'
    if lat < -30:
        return 'Oceania'
    return 'Outros'


def infer_country(row):
    place = str(row['place']).lower()
    if any(term in place for term in ['brazil', 'brasil']):
        return 'Brasil'
    if any(term in place for term in ['colombia', 'colômbia']):
        return 'Colômbia'
    if any(term in place for term in ['japan', 'japão']):
        return 'Japão'
    if any(term in place for term in ['mexico', 'méxico']):
        return 'México'
    if any(term in place for term in ['indonesia', 'indonésia']):
        return 'Indonésia'
    if any(term in place for term in ['italy', 'italia', 'itália']):
        return 'Itália'
    if any(term in place for term in ['peru', 'perú']):
        return 'Peru'
    if any(term in place for term in ['puerto rico', 'virgin', 'hawaii', 'alaska']):
        return 'Estados Unidos'
    return 'Outros'


df = buscar_dados_usgs(100)
df['date'] = df['data_hora'].dt.strftime('%Y-%m-%d')
df['region'] = df.apply(infer_region, axis=1)
df['country'] = df.apply(infer_country, axis=1)
df['place'] = df['place'].fillna('Local desconhecido')

records = []
for _, row in df.iterrows():
    records.append({
        'id': row['id'],
        'place': row['place'],
        'region': row['region'],
        'country': row['country'],
        'date': row['date'],
        'mag': round(float(row['mag']), 1),
        'depth': round(float(row['profundidade_km']), 1),
    })

repo_root = Path(__file__).resolve().parents[2]
out_path = repo_root / 'docs' / 'projetos' / 'analise-simicos' / 'results' / 'dashboard-data.js'
out_path.parent.mkdir(parents=True, exist_ok=True)
out_path.write_text('const data = ' + json.dumps(records, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
print(f'Arquivo salvo em {out_path}')
