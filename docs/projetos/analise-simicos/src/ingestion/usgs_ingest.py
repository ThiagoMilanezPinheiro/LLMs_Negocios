import time
from datetime import datetime, timezone
from typing import Any, Dict, List

import requests


USGS_URL = "https://earthquake.usgs.gov/fdsnws/event/1/query"


def _request_usgs_page(params: Dict[str, Any]) -> List[Dict[str, Any]]:
    for attempt in range(3):
        try:
            response = requests.get(USGS_URL, params=params, timeout=60)
            if response.status_code == 429:
                time.sleep(2 * (attempt + 1))
                continue
            response.raise_for_status()
            payload = response.json()
            return payload.get("features", [])
        except requests.RequestException:
            if attempt == 2:
                raise
            time.sleep(1.5 * (attempt + 1))
    return []


def fetch_usgs_events(
    limit: int = 100,
    min_magnitude: float = 2.5,
    start_time: str | None = None,
    end_time: str | None = None,
    max_results: int = 20000,
    fetch_all: bool = False,
) -> List[Dict[str, Any]]:
    page_size = max(1, min(limit, 20000))
    params = {
        "format": "geojson",
        "eventtype": "earthquake",
        "orderby": "time",
        "limit": page_size,
        "minmagnitude": min_magnitude,
    }
    if start_time:
        params["starttime"] = start_time
    if end_time:
        params["endtime"] = end_time

    if not fetch_all:
        batch = _request_usgs_page(params)
        return batch[:max_results]

    features: List[Dict[str, Any]] = []
    offset = 1
    remaining = max_results

    while remaining > 0:
        current_limit = min(page_size, remaining)
        params["limit"] = current_limit
        params["offset"] = offset

        batch = _request_usgs_page(params)
        if not batch:
            break

        features.extend(batch)
        remaining -= len(batch)
        if len(batch) < current_limit:
            break

        offset += len(batch)
        time.sleep(0.2)

    return features[:max_results]


def normalize_usgs_feature(feature: Dict[str, Any], ingestion_timestamp: datetime) -> Dict[str, Any]:
    props = feature.get("properties", {}) or {}
    geometry = feature.get("geometry", {}) or {}
    coords = geometry.get("coordinates", []) or []

    event_time = props.get("time")
    event_time_dt = None
    if event_time is not None:
        try:
            event_time_dt = datetime.fromtimestamp(int(event_time) / 1000, tz=timezone.utc)
        except (TypeError, ValueError):
            event_time_dt = None

    return {
        "event_id": feature.get("id"),
        "source": "USGS",
        "source_url": USGS_URL,
        "network": props.get("net"),
        "event_code": props.get("code"),
        "event_url": props.get("url"),
        "detail_url": props.get("detail"),
        "event_time_utc": event_time_dt,
        "event_date": event_time_dt.date().isoformat() if event_time_dt else None,
        "event_time": event_time_dt.time().isoformat() if event_time_dt else None,
        "event_hour": event_time_dt.hour if event_time_dt else None,
        "event_minute": event_time_dt.minute if event_time_dt else None,
        "day_of_week": event_time_dt.weekday() + 1 if event_time_dt else None,
        "day_of_month": event_time_dt.day if event_time_dt else None,
        "week": event_time_dt.isocalendar().week if event_time_dt else None,
        "month": event_time_dt.month if event_time_dt else None,
        "month_name": event_time_dt.strftime("%B") if event_time_dt else None,
        "quarter": (event_time_dt.month - 1) // 3 + 1 if event_time_dt else None,
        "year": event_time_dt.year if event_time_dt else None,
        "latitude": coords[1] if len(coords) > 1 else None,
        "longitude": coords[0] if len(coords) > 0 else None,
        "depth_km": coords[2] if len(coords) > 2 else None,
        "place_raw": props.get("place"),
        "magnitude": props.get("mag"),
        "magnitude_type": props.get("magType"),
        "tsunami": bool(props.get("tsunami", 0)),
        "alert": props.get("alert"),
        "felt": props.get("felt"),
        "cdi": props.get("cdi"),
        "mmi": props.get("mmi"),
        "status": props.get("status"),
        "nst": props.get("nst"),
        "dmin": props.get("dmin"),
        "rms": props.get("rms"),
        "gap": props.get("gap"),
        "usgs_significance": props.get("sig"),
        "ingestion_timestamp": ingestion_timestamp,
        "processing_timestamp": ingestion_timestamp,
        "updated_at": props.get("updated") if props.get("updated") else None,
        "source_url": USGS_URL,
        "event_url": props.get("url"),
        "detail_url": props.get("detail"),
        "data_quality_reason": None,
        "data_quality_flag": "VALID",
        "duplicate_flag": False,
    }
