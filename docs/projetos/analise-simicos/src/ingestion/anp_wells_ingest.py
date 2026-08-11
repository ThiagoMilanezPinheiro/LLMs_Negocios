from datetime import datetime, timezone
from typing import Any, Dict, List


ANP_WFS_URL = "https://gishub.anp.gov.br/geoserver/BD_ANP/ows"


def fetch_anp_wells(max_features: int = 40000) -> List[Dict[str, Any]]:
    import requests

    params = {
        "service": "WFS",
        "version": "1.0.0",
        "request": "GetFeature",
        "typeName": "BD_ANP:POCOS_SIRGAS",
        "maxFeatures": max(1, min(max_features, 100000)),
        "outputFormat": "application/json",
    }
    response = requests.get(ANP_WFS_URL, params=params, timeout=120)
    response.raise_for_status()
    payload = response.json()
    return payload.get("features", [])


def normalize_anp_well_feature(feature: Dict[str, Any], ingestion_timestamp: datetime) -> Dict[str, Any]:
    props = feature.get("properties", {}) or {}
    geometry = feature.get("geometry", {}) or {}
    coordinates = geometry.get("coordinates", []) or []

    longitude = coordinates[0] if len(coordinates) > 0 else None
    latitude = coordinates[1] if len(coordinates) > 1 else None

    return {
        "well_id": feature.get("id"),
        "well_name": props.get("POCO"),
        "well_name_operator": props.get("POCO_OPERA"),
        "registry_code": props.get("CADASTRO"),
        "operator": props.get("OPERADOR"),
        "state": props.get("ESTADO"),
        "basin": props.get("BACIA"),
        "block": props.get("BLOCO"),
        "field": props.get("CAMPO"),
        "field_code": props.get("SIG_CAMPO"),
        "well_type": props.get("TIPO"),
        "well_category": props.get("CATEGORIA"),
        "well_status": props.get("SITUACAO"),
        "environment": "Onshore" if props.get("TERRA_MAR") == "T" else "Offshore" if props.get("TERRA_MAR") == "M" else None,
        "ownership": props.get("TITULARIDA"),
        "coordinate_datum": props.get("DATUM_HORI") or "SIRGAS2000",
        "latitude": latitude,
        "longitude": longitude,
        "source": "ANP",
        "source_url": ANP_WFS_URL,
        "ingestion_timestamp": ingestion_timestamp,
        "processing_timestamp": ingestion_timestamp,
    }
