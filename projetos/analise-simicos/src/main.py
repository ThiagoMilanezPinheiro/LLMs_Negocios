from pathlib import Path
from typing import Any
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import requests

sns.set_style("whitegrid")

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "dados_usgs.csv"
RESULTS_DIR = ROOT / "results"
USGS_URL = "https://earthquake.usgs.gov/fdsnws/event/1/query"


def buscar_dados_usgs(limit: int = 100) -> pd.DataFrame:
    params = {
        "format": "geojson",
        "eventtype": "earthquake",
        "orderby": "time",
        "limit": limit,
        "minmagnitude": 2.5,
    }
    response = requests.get(USGS_URL, params=params, timeout=30)
    response.raise_for_status()
    payload = response.json()
    return normalizar_eventos(payload)


def normalizar_eventos(payload: dict[str, Any]) -> pd.DataFrame:
    features = payload.get("features", [])
    rows = []
    for feature in features:
        properties = feature.get("properties", {})
        geometry = feature.get("geometry", {})
        coordinates = geometry.get("coordinates", [None, None, None])
        rows.append(
            {
                "id": feature.get("id"),
                "mag": properties.get("mag"),
                "place": properties.get("place"),
                "time": properties.get("time"),
                "data_hora": pd.to_datetime(properties.get("time"), unit="ms", utc=True),
                "status": properties.get("status"),
                "tsunami": properties.get("tsunami"),
                "tipo": properties.get("type"),
                "longitude": coordinates[0],
                "latitude": coordinates[1],
                "profundidade_km": coordinates[2],
            }
        )
    return pd.DataFrame(rows)


def salvar_dados(df: pd.DataFrame, path: Path) -> None:
    path.parent.mkdir(exist_ok=True, parents=True)
    df.to_csv(path, index=False)


def carregar_dados(path: Path) -> pd.DataFrame:
    if not path.exists():
        raise FileNotFoundError(f"Arquivo de dados não encontrado: {path}")
    return pd.read_csv(path)


def inferir_regiao(latitude: float, longitude: float, place: str | None = None) -> str:
    texto = (place or "").lower()

    if any(p in texto for p in ["colombia", "colômbia", "peru", "perú", "brazil", "brasil", "chile", "argentina", "bolivia", "ecuador", "uruguay", "paraguay", "venezuela"]):
        return "América do Sul"
    if longitude < -30 and latitude < 15 and latitude > -60:
        return "América do Sul"
    if latitude > 20 and longitude > 100:
        return "Ásia"
    if latitude > 35 and -10 <= longitude <= 40:
        return "Europa"
    if latitude > 20 and longitude < -90:
        return "América do Norte"
    if latitude < -30:
        return "Oceania"
    return "Outros"


def inferir_pais(latitude: float, longitude: float, place: str | None = None) -> str:
    texto = (place or "").lower()

    if any(p in texto for p in ["brazil", "brasil"]):
        return "Brasil"
    if any(p in texto for p in ["colombia", "colômbia", "colombia"]):
        return "Colômbia"
    if any(p in texto for p in ["peru", "perú", "peru"]):
        return "Peru"
    if any(p in texto for p in ["philippines", "filipinas"]):
        return "Filipinas"
    if any(p in texto for p in ["indonesia", "indonésia"]):
        return "Indonésia"
    if any(p in texto for p in ["iran", "irã"]):
        return "Irã"
    if any(p in texto for p in ["papua new guinea", "papua nova guiné", "papua"]):
        return "Papua Nova Guiné"
    if any(p in texto for p in ["ethiopia", "etiópia"]):
        return "Etiópia"
    if any(p in texto for p in ["fiji"]):
        return "Fiji"
    if any(p in texto for p in ["dominican republic", "república dominicana", "dominican"]):
        return "República Dominicana"
    if any(p in texto for p in ["puerto rico", "virgin islands", "u.s. virgin islands"]):
        return "Porto Rico"
    if any(p in texto for p in ["japan", "japão"]):
        return "Japão"
    if any(p in texto for p in ["italy", "italia", "itália"]):
        return "Itália"
    if any(p in texto for p in ["mexico", "méxico", "b.c.", "mx"]):
        return "México"
    if any(p in texto for p in ["new zealand", "nova zelândia", "zealand"]):
        return "Nova Zelândia"
    if any(p in texto for p in ["hawaii", "hawaï"]):
        return "Estados Unidos"
    if any(p in texto for p in ["alaska"]):
        return "Estados Unidos"

    if latitude < -20 and longitude < -30:
        return "Brasil"
    if latitude > 20 and longitude > 100:
        return "Japão"
    if latitude > 35 and -10 <= longitude <= 40:
        return "Itália"
    if latitude > 20 and longitude < -90:
        return "México"
    if latitude < -30:
        return "Nova Zelândia"
    return "Outros"


def analisar_dados(df: pd.DataFrame) -> None:
    print("=" * 60)
    print("ANÁLISE EXPLORATÓRIA")
    print("=" * 60)
    print(f"\nShape: {df.shape}")
    print("\nTipos de dados:")
    print(df.dtypes)
    print("\nResumo estatístico:")
    print(df.describe(include="all"))
    print("\nValores faltantes:")
    print(df.isnull().sum())


def aplicar_filtros(df: pd.DataFrame, regiao: str | None = None, pais: str | None = None, ano: int | None = None, mes: int | None = None, dia: int | None = None) -> pd.DataFrame:
    df_filtrado = df.copy()
    df_filtrado["regiao"] = df_filtrado.apply(lambda row: inferir_regiao(row["latitude"], row["longitude"]), axis=1)
    df_filtrado["pais"] = df_filtrado.apply(lambda row: inferir_pais(row["latitude"], row["longitude"], row.get("place")), axis=1)
    df_filtrado["data_hora"] = pd.to_datetime(df_filtrado["data_hora"], utc=True)

    if regiao:
        df_filtrado = df_filtrado[df_filtrado["regiao"] == regiao]
    if pais:
        df_filtrado = df_filtrado[df_filtrado["pais"] == pais]
    if ano is not None:
        df_filtrado = df_filtrado[df_filtrado["data_hora"].dt.year == ano]
    if mes is not None:
        df_filtrado = df_filtrado[df_filtrado["data_hora"].dt.month == mes]
    if dia is not None:
        df_filtrado = df_filtrado[df_filtrado["data_hora"].dt.day == dia]

    return df_filtrado


def gerar_graficos(df: pd.DataFrame, output_dir: Path) -> None:
    output_dir.mkdir(exist_ok=True)

    df_plot = df.copy()
    df_plot["regiao"] = df_plot.apply(lambda row: inferir_regiao(row["latitude"], row["longitude"], row.get("place")), axis=1)
    df_plot["pais"] = df_plot.apply(lambda row: inferir_pais(row["latitude"], row["longitude"], row.get("place")), axis=1)

    numeric_cols = df.select_dtypes(include=["number"]).columns
    if len(numeric_cols) >= 1:
        fig, ax = plt.subplots(figsize=(8, 4))
        df[numeric_cols[0]].hist(bins=15, edgecolor="black", ax=ax)
        ax.set_title(f"Distribuição de {numeric_cols[0]}")
        ax.set_xlabel(numeric_cols[0])
        ax.set_ylabel("Frequência")
        fig.tight_layout()
        fig.savefig(output_dir / "distribuicao.png", dpi=300)
        plt.close(fig)

    if len(numeric_cols) >= 2:
        corr = df[numeric_cols].corr()
        fig, ax = plt.subplots(figsize=(7, 5))
        sns.heatmap(corr, annot=True, fmt=".2f", cmap="coolwarm", ax=ax)
        ax.set_title("Matriz de Correlação")
        fig.tight_layout()
        fig.savefig(output_dir / "correlacao.png", dpi=300)
        plt.close(fig)

    regiao_counts = df_plot.groupby("regiao").size().reset_index(name="total")
    fig, ax = plt.subplots(figsize=(8, 5))
    sns.barplot(data=regiao_counts, x="regiao", y="total", palette="viridis", ax=ax)
    ax.set_title("Eventos por Região")
    ax.set_xlabel("Região")
    ax.set_ylabel("Quantidade de eventos")
    ax.tick_params(axis="x", rotation=30)
    fig.tight_layout()
    fig.savefig(output_dir / "eventos_por_regiao.png", dpi=300)
    plt.close(fig)

    fig, ax = plt.subplots(figsize=(8, 5))
    sns.scatterplot(data=df_plot, x="longitude", y="latitude", hue="regiao", s=70, alpha=0.8, ax=ax)
    ax.set_title("Distribuição Geográfica dos Eventos")
    ax.set_xlabel("Longitude")
    ax.set_ylabel("Latitude")
    fig.tight_layout()
    fig.savefig(output_dir / "distribuicao_geografica.png", dpi=300)
    plt.close(fig)

    pais_counts = df_plot.groupby("pais").size().reset_index(name="total")
    fig, ax = plt.subplots(figsize=(8, 5))
    sns.barplot(data=pais_counts, x="pais", y="total", palette="magma", ax=ax)
    ax.set_title("Eventos por País")
    ax.set_xlabel("País")
    ax.set_ylabel("Quantidade de eventos")
    ax.tick_params(axis="x", rotation=30)
    fig.tight_layout()
    fig.savefig(output_dir / "eventos_por_pais.png", dpi=300)
    plt.close(fig)

    temporal = df_plot.copy()
    if "data_hora" in temporal.columns:
        temporal["data"] = pd.to_datetime(temporal["data_hora"]).dt.normalize()
    elif "time" in temporal.columns:
        temporal["data"] = pd.to_datetime(temporal["time"], unit="ms", utc=True).dt.normalize()
    else:
        temporal["data"] = pd.NaT

    if temporal["data"].notna().any():
        daily_counts = temporal.groupby("data").size().reset_index(name="eventos")
        fig, ax = plt.subplots(figsize=(10, 5))
        sns.lineplot(data=daily_counts, x="data", y="eventos", marker="o", ax=ax)
        ax.set_title("Eventos por Dia")
        ax.set_xlabel("Data")
        ax.set_ylabel("Quantidade de eventos")
        fig.tight_layout()
        fig.savefig(output_dir / "eventos_por_dia.png", dpi=300)
        plt.close(fig)

        daily_mag = temporal.groupby("data")["mag"].mean().reset_index(name="magnitude_media")
        fig, ax = plt.subplots(figsize=(10, 5))
        sns.lineplot(data=daily_mag, x="data", y="magnitude_media", marker="o", ax=ax)
        ax.set_title("Magnitude Média por Dia")
        ax.set_xlabel("Data")
        ax.set_ylabel("Magnitude média")
        fig.tight_layout()
        fig.savefig(output_dir / "magnitude_media_por_dia.png", dpi=300)
        plt.close(fig)


def salvar_relatorio(df: pd.DataFrame, output_dir: Path) -> None:
    report_path = output_dir / "relatorio.txt"
    with report_path.open("w", encoding="utf-8") as f:
        f.write("RELATÓRIO DA ANÁLISE\n")
        f.write("=" * 40 + "\n")
        f.write(f"Linhas: {len(df)}\n")
        f.write(f"Colunas: {list(df.columns)}\n")
        f.write("\nResumo:\n")
        f.write(df.describe(include="all").to_string())
    print(f"\nRelatório salvo em {report_path}")


def gerar_resumo_drilldown(df: pd.DataFrame, output_dir: Path, regiao: str | None = None, pais: str | None = None, ano: int | None = None, mes: int | None = None, dia: int | None = None) -> None:
    resumo_path = output_dir / "resumo_drilldown.txt"
    with resumo_path.open("w", encoding="utf-8") as f:
        f.write("RESUMO DO DRILL-DOWN\n")
        f.write("=" * 40 + "\n")
        f.write(f"Região: {regiao or 'Todas'}\n")
        f.write(f"País: {pais or 'Todos'}\n")
        f.write(f"Ano: {ano if ano is not None else 'Todos'}\n")
        f.write(f"Mês: {mes if mes is not None else 'Todos'}\n")
        f.write(f"Dia: {dia if dia is not None else 'Todos'}\n\n")
        f.write(f"Eventos encontrados: {len(df)}\n")
        f.write(f"Magnitude média: {df['mag'].mean():.2f}\n")
        f.write(f"Profundidade média: {df['profundidade_km'].mean():.2f} km\n")
    print(f"Resumo do drill-down salvo em {resumo_path}")


def main() -> None:
    df = buscar_dados_usgs()
    salvar_dados(df, DATA_FILE)
    df = aplicar_filtros(df)
    analisar_dados(df)
    gerar_graficos(df, RESULTS_DIR)
    salvar_relatorio(df, RESULTS_DIR)
    gerar_resumo_drilldown(df, RESULTS_DIR)
    print("\nAnálise concluída com sucesso.")


if __name__ == "__main__":
    main()
