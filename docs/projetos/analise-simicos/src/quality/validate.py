from typing import Any, Dict, List, Optional


def validate_rows(rows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    validated: List[Dict[str, Any]] = []
    for row in rows:
        reasons: List[str] = []
        if not row.get("event_id"):
            reasons.append("Missing event_id")
        if row.get("event_time_utc") is None:
            reasons.append("Missing event_time_utc")
        if row.get("latitude") is None:
            reasons.append("Missing latitude")
        if row.get("longitude") is None:
            reasons.append("Missing longitude")
        if row.get("magnitude") is None:
            reasons.append("Missing magnitude")
        if row.get("depth_km") is None:
            reasons.append("Missing depth_km")
        if not row.get("source"):
            reasons.append("Missing source")

        if reasons:
            row["data_quality_flag"] = "WARNING"
            row["data_quality_reason"] = "; ".join(reasons)
        else:
            row["data_quality_flag"] = "VALID"
            row["data_quality_reason"] = None
        validated.append(row)
    return validated
