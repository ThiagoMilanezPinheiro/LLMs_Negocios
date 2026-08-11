# Seismic Intelligence Platform

## Objective

This project builds a real-world earthquake fact layer from the official USGS earthquake feed.

## Source

- USGS GeoJSON event feed
- URL: [USGS event feed](https://earthquake.usgs.gov/fdsnws/event/1/query)

## Pipeline

1. Ingest real events from USGS.
2. Normalize raw event fields.
3. Derive analytical dimensions.
4. Validate data quality.
5. Persist to Parquet and DuckDB.

## Output

- Parquet: data/curated/fact_earthquake.parquet
- DuckDB: data/curated/earthquakes.duckdb

## Data quality rules

- Null is preferred over invented values.
- Missing coordinates, magnitude, depth, or country remain null.
- The pipeline preserves source lineage fields.

## Analytical scatter

- The chart `Magnitude × Profundidade` is rendered as a two-level analytical view.
- The main panel uses the real depth distribution to isolate the dominant seismicity range with a P90-based split.
- Events deeper than the main range remain visible in a dedicated `Deep Events` panel.
- Point size prefers `USGS significance` when available; otherwise magnitude is used as the fallback size signal.
- Point color encodes the real geographic region.
- Deepest event and largest-magnitude event are highlighted automatically from the dataset.
