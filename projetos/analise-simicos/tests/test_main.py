import pandas as pd

from src.main import inferir_pais, inferir_regiao, normalizar_eventos


def test_normalizar_eventos():
    payload = {
        "features": [
            {
                "id": "test-1",
                "properties": {
                    "mag": 5.2,
                    "place": "10 km N of Example",
                    "time": 1735689600000,
                    "status": "reviewed",
                    "tsunami": 0,
                    "type": "earthquake",
                },
                "geometry": {"coordinates": [-46.1, -23.5, 15.0]},
            }
        ]
    }

    df = normalizar_eventos(payload)

    assert not df.empty
    assert "mag" in df.columns
    assert "latitude" in df.columns
    assert df.loc[0, "mag"] == 5.2
    assert df.loc[0, "place"] == "10 km N of Example"
    assert pd.api.types.is_datetime64_any_dtype(df["data_hora"])


def test_inferir_regiao():
    assert inferir_regiao(-23.5, -46.1) == "América do Sul"
    assert inferir_regiao(35.7, 139.7) == "Ásia"
    assert inferir_regiao(51.5, -0.1) == "Europa"


def test_inferir_pais():
    assert inferir_pais(-23.5, -46.1) == "Brasil"
    assert inferir_pais(35.7, 139.7) == "Japão"
    assert inferir_pais(51.5, -0.1) == "Itália"


def test_inferir_pais_por_localizacao_e_texto():
    assert inferir_pais(4.8971, -76.3859, "16 km W of San José del Palmar, Colombia") == "Colômbia"
    assert inferir_pais(8.9207, 126.0577, "13 km ESE of San Miguel, Philippines") == "Filipinas"
    assert inferir_pais(32.6863, 48.0359, "55 km NW of Shahrak-e Kūlūrī, Iran") == "Irã"
    assert inferir_pais(-5.9347, 102.3607, "232 km SSW of Pagar Alam, Indonesia") == "Indonésia"
