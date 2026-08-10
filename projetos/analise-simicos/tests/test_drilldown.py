import pandas as pd

from src.main import aplicar_filtros, normalizar_eventos


def test_aplicar_filtros_por_regiao_pais_e_tempo():
    payload = {
        "features": [
            {
                "id": "a",
                "properties": {
                    "mag": 3.0,
                    "place": "Colombia",
                    "time": 1735689600000,
                    "status": "reviewed",
                    "tsunami": 0,
                    "type": "earthquake",
                },
                "geometry": {"coordinates": [-74.0, 4.5, 20.0]},
            },
            {
                "id": "b",
                "properties": {
                    "mag": 5.0,
                    "place": "Japan",
                    "time": 1735776000000,
                    "status": "reviewed",
                    "tsunami": 0,
                    "type": "earthquake",
                },
                "geometry": {"coordinates": [139.7, 35.7, 20.0]},
            },
        ]
    }

    df = normalizar_eventos(payload)
    filtrado = aplicar_filtros(df, regiao="América do Sul", pais="Colômbia", ano=2025, mes=1)

    assert len(filtrado) == 1
    assert filtrado.iloc[0]["pais"] == "Colômbia"
