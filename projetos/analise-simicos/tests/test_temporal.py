import pandas as pd

from src.main import normalizar_eventos


def test_normalizar_eventos_preserva_temporal():
    payload = {
        "features": [
            {
                "id": "test-2",
                "properties": {
                    "mag": 4.3,
                    "place": "Test location",
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
    assert pd.api.types.is_datetime64_any_dtype(df["data_hora"])
    assert df.loc[0, "data_hora"].year == 2025
