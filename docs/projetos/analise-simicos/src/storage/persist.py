import os
from datetime import datetime
from typing import Any, Dict, List

import pandas as pd
import pyarrow as pa
import pyarrow.parquet as pq


def ensure_directories(base_dir: str) -> None:
    for folder in ["data/raw", "data/staging", "data/curated", "data/test/fixtures"]:
        os.makedirs(os.path.join(base_dir, folder), exist_ok=True)


def persist_parquet(rows: List[Dict[str, Any]], output_path: str) -> None:
    df = pd.DataFrame(rows)
    for column in ["event_time_utc", "ingestion_timestamp", "processing_timestamp", "updated_at"]:
        if column in df.columns:
            df[column] = pd.to_datetime(df[column], utc=True, errors="coerce")
    df.to_parquet(output_path, index=False)


def persist_duckdb(rows: List[Dict[str, Any]], db_path: str, table_name: str = "fact_earthquake") -> None:
    import duckdb
    df = pd.DataFrame(rows)
    for column in ["event_time_utc", "ingestion_timestamp", "processing_timestamp", "updated_at"]:
        if column in df.columns:
            df[column] = pd.to_datetime(df[column], utc=True, errors="coerce")
    con = duckdb.connect(db_path)
    con.register("earthquake_df", df)
    con.execute(f"DROP TABLE IF EXISTS {table_name}")
    con.execute(f"CREATE TABLE {table_name} AS SELECT * FROM earthquake_df")
    con.close()
