from pathlib import Path

from src.main import gerar_graficos


def test_gerar_graficos_cria_arquivos(tmp_path):
    import pandas as pd

    df = pd.DataFrame(
        {
            "mag": [2.5, 4.1, 5.0],
            "longitude": [-46.0, 139.7, -0.1],
            "latitude": [-23.5, 35.7, 51.5],
        }
    )

    gerar_graficos(df, tmp_path)

    expected_files = [
        "distribuicao.png",
        "correlacao.png",
        "eventos_por_regiao.png",
        "distribuicao_geografica.png",
    ]

    for name in expected_files:
        assert (tmp_path / name).exists(), f"Arquivo esperado não encontrado: {name}"
