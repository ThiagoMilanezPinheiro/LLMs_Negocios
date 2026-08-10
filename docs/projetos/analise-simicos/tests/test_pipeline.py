from pathlib import Path

from src.pipeline import run_pipeline


def test_pipeline_creates_outputs():
    report = run_pipeline(limit=10, min_magnitude=2.5)
    assert report["records_received"] == 10
    assert report["records_processed"] == 10
    assert Path(report["parquet_path"]).exists()
    assert Path(report["duckdb_path"]).exists()


def test_pipeline_accepts_2026_date_window():
    report = run_pipeline(
        limit=10,
        min_magnitude=2.5,
        start_time="2026-01-01",
        end_time="2026-12-31",
    )
    assert report["records_received"] == 10
    assert report["date_window"] == {"start_time": "2026-01-01", "end_time": "2026-12-31"}
