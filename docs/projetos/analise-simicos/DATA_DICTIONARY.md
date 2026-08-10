# Data Dictionary

| field | description | data_type | category | source | calculated | enriched | nullable | validation_rule |
|---|---|---|---|---|---|---|---|---|
| event_id | Official event identifier from USGS | STRING | SOURCE | USGS | No | No | No | Must be non-empty |
| source | Data source name | STRING | LINEAGE | USGS | No | No | No | Must be non-empty |
| event_time_utc | Event timestamp in UTC | TIMESTAMP | SOURCE | USGS | No | No | No | Must be parseable |
| latitude | Event latitude | DOUBLE | SOURCE | USGS | No | No | No | Between -90 and 90 |
| longitude | Event longitude | DOUBLE | SOURCE | USGS | No | No | No | Between -180 and 180 |
| depth_km | Event depth in km | DOUBLE | SOURCE | USGS | No | No | Yes | Must be numeric if present |
| magnitude | Event magnitude | DOUBLE | SOURCE | USGS | No | No | Yes | Must be numeric if present |
| magnitude_type | Magnitude type from USGS | STRING | SOURCE | USGS | No | No | Yes | Must be preserved |
| magnitude_band | Magnitude bucket | STRING | DERIVED | Project | Yes | No | Yes | Deterministic |
| depth_band | Depth bucket | STRING | DERIVED | Project | Yes | No | Yes | Deterministic |
| analytical_score | Project analytical score | DOUBLE | ANALYTICAL | Project | Yes | No | Yes | Deterministic |
| analytical_severity | Project severity label | STRING | ANALYTICAL | Project | Yes | No | Yes | Deterministic |
| place_raw | Original place string from USGS | STRING | SOURCE | USGS | No | No | Yes | Preserve original |
| country | Country name | STRING | ENRICHED | Project | No | Yes | Yes | Null if unresolved |
| region | Regional classification | STRING | ENRICHED | Project | No | Yes | Yes | Null if unresolved |
| data_quality_flag | Data quality status | STRING | QUALITY | Project | Yes | No | No | VALID/WARNING |
| data_quality_reason | Quality issue explanation | STRING | QUALITY | Project | Yes | No | Yes | Null when no issue |
| duplicate_flag | Duplicate event flag | BOOLEAN | QUALITY | Project | Yes | No | No | False by default |
| source_url | Source endpoint URL | STRING | LINEAGE | USGS | No | No | No | Must be non-empty |
| event_url | Event URL from source | STRING | LINEAGE | USGS | No | No | Yes | Preserve source URL |
| detail_url | Detail URL from source | STRING | LINEAGE | USGS | No | No | Yes | Preserve source URL |
| ingestion_timestamp | Ingestion time | TIMESTAMP | LINEAGE | Project | Yes | No | No | UTC |
| processing_timestamp | Processing time | TIMESTAMP | LINEAGE | Project | Yes | No | No | UTC |
| updated_at | Updated timestamp from source | TIMESTAMP | LINEAGE | USGS | No | No | Yes | Preserve if present |
