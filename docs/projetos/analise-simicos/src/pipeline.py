from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List

from src.ingestion.anp_wells_ingest import fetch_anp_wells, normalize_anp_well_feature
from src.ingestion.usgs_ingest import fetch_usgs_events, normalize_usgs_feature
from src.quality.validate import validate_rows
from src.transformation.build_fact import transform_rows
from src.storage.persist import ensure_directories, persist_duckdb, persist_parquet


PROJECT_ROOT = Path(__file__).resolve().parents[1]
BASE_DIR = PROJECT_ROOT


def run_pipeline(
    limit: int = 1000,
    min_magnitude: float = 2.5,
    start_time: str | None = "2026-01-01",
    end_time: str | None = "2026-12-31",
    fetch_all: bool = False,
    max_results: int = 20000,
    include_anp_wells: bool = False,
    anp_wells_max_features: int = 40000,
) -> Dict[str, Any]:
    ensure_directories(str(BASE_DIR))
    ingestion_timestamp = datetime.now(timezone.utc)
    raw_features = fetch_usgs_events(
        limit=limit,
        min_magnitude=min_magnitude,
        start_time=start_time,
        end_time=end_time,
        fetch_all=fetch_all,
        max_results=max_results,
    )

    normalized_rows = [normalize_usgs_feature(feature, ingestion_timestamp) for feature in raw_features]
    transformed_rows = transform_rows(normalized_rows)
    validated_rows = validate_rows(transformed_rows)

    output_dir = BASE_DIR / "data" / "curated"
    output_dir.mkdir(parents=True, exist_ok=True)
    parquet_path = output_dir / "fact_earthquake.parquet"
    duckdb_path = BASE_DIR / "data" / "curated" / "earthquakes.duckdb"

    persist_parquet(validated_rows, str(parquet_path))
    persist_duckdb(validated_rows, str(duckdb_path))

    wells_rows: List[Dict[str, Any]] = []
    wells_parquet_path = None
    if include_anp_wells:
        raw_wells = fetch_anp_wells(max_features=anp_wells_max_features)
        wells_rows = [normalize_anp_well_feature(well, ingestion_timestamp) for well in raw_wells]
        wells_parquet = output_dir / "dim_anp_well.parquet"
        persist_parquet(wells_rows, str(wells_parquet))
        persist_duckdb(wells_rows, str(duckdb_path), table_name="dim_anp_well")
        wells_parquet_path = str(wells_parquet)

    report = {
        "source": "USGS",
        "source_url": "https://earthquake.usgs.gov/fdsnws/event/1/query",
        "ingestion_timestamp": ingestion_timestamp.isoformat(),
        "date_window": {"start_time": start_time, "end_time": end_time},
        "records_received": len(raw_features),
        "records_processed": len(validated_rows),
        "fetch_all": fetch_all,
        "max_results": max_results,
        "records_valid": sum(1 for row in validated_rows if row.get("data_quality_flag") == "VALID"),
        "records_warning": sum(1 for row in validated_rows if row.get("data_quality_flag") == "WARNING"),
        "parquet_path": str(parquet_path),
        "duckdb_path": str(duckdb_path),
        "include_anp_wells": include_anp_wells,
        "anp_wells_records": len(wells_rows),
        "anp_wells_parquet_path": wells_parquet_path,
    }
    return report


if __name__ == "__main__":
    print(run_pipeline())
