import math
import re
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional


def build_magnitude_band(magnitude: Optional[float]) -> Optional[str]:
    if magnitude is None:
        return None
    if magnitude < 2:
        return "<2"
    if magnitude < 3:
        return "2–3"
    if magnitude < 4:
        return "3–4"
    if magnitude < 5:
        return "4–5"
    if magnitude < 6:
        return "5–6"
    if magnitude < 7:
        return "6–7"
    return "7+"


def build_depth_band(depth_km: Optional[float]) -> Optional[str]:
    if depth_km is None:
        return None
    if depth_km < 10:
        return "0–10 km"
    if depth_km < 50:
        return "10–50 km"
    if depth_km < 100:
        return "50–100 km"
    if depth_km < 300:
        return "100–300 km"
    return "300+ km"


def build_analytical_score(row: Dict[str, Any]) -> float:
    magnitude = row.get("magnitude")
    depth_km = row.get("depth_km")
    score = 0.0
    if magnitude is not None:
        score += float(magnitude) * 10.0
    if depth_km is not None:
        score += max(0.0, 100.0 - float(depth_km)) / 20.0
    if row.get("tsunami"):
        score += 20.0
    if row.get("alert"):
        score += 15.0
    return round(min(score, 100.0), 2)


def build_analytical_severity(magnitude: Optional[float]) -> Optional[str]:
    if magnitude is None:
        return None
    if magnitude >= 7:
        return "MAJOR"
    if magnitude >= 6:
        return "HIGH"
    if magnitude >= 5:
        return "SIGNIFICANT"
    if magnitude >= 4:
        return "MODERATE"
    return "LOW"


def infer_geography_from_place(place_raw: Optional[str]) -> Dict[str, Optional[str]]:
    if not place_raw:
        return {"country": None, "country_code": None, "region": None, "admin1": None, "city": None, "nearest_city": None, "place_reference": None, "place_direction": None}

    text = place_raw.strip()
    lower = text.lower()
    result: Dict[str, Optional[str]] = {
        "country": None,
        "country_code": None,
        "region": None,
        "admin1": None,
        "city": None,
        "nearest_city": None,
        "place_reference": None,
        "place_direction": None,
    }

    if re.search(r"\b(alaska|hawaii|california|washington|oregon|idaho|oklahoma|texas)\b", lower):
        result["country"] = "United States"
        result["country_code"] = "US"
        result["region"] = "North America"
    elif re.search(r"\b(mexico|b\.c\.|bc)\b", lower):
        result["country"] = "Mexico"
        result["country_code"] = "MX"
        result["region"] = "North America"
    elif re.search(r"\b(colombia|peru|chile|argentina|brazil|ecuador|bolivia|paraguay|uruguay)\b", lower):
        result["country"] = "Colombia" if "colombia" in lower else "Peru" if "peru" in lower else "Chile" if "chile" in lower else "Argentina" if "argentina" in lower else "Brazil" if "brazil" in lower else "Ecuador" if "ecuador" in lower else "Bolivia" if "bolivia" in lower else "Paraguay" if "paraguay" in lower else "Uruguay"
        result["country_code"] = None
        result["region"] = "South America"
    elif re.search(r"\b(indonesia|philippines|vanuatu|papua new guinea|fiji|tonga|new zealand|japan|india|iran|turkey|greece|ethiopia|russia|china|pakistan|afghanistan|saudi arabia)\b", lower):
        if "indonesia" in lower:
            result["country"] = "Indonesia"
        elif "philippines" in lower:
            result["country"] = "Philippines"
        elif "vanuatu" in lower:
            result["country"] = "Vanuatu"
        elif "papua new guinea" in lower:
            result["country"] = "Papua New Guinea"
        elif "fiji" in lower:
            result["country"] = "Fiji"
        elif "tonga" in lower:
            result["country"] = "Tonga"
        elif "new zealand" in lower:
            result["country"] = "New Zealand"
        elif "india" in lower:
            result["country"] = "India"
        elif "iran" in lower:
            result["country"] = "Iran"
        elif "turkey" in lower:
            result["country"] = "Turkey"
        elif "greece" in lower:
            result["country"] = "Greece"
        elif "ethiopia" in lower:
            result["country"] = "Ethiopia"
        elif "russia" in lower:
            result["country"] = "Russia"
        elif "japan" in lower:
            result["country"] = "Japan"
        else:
            result["country"] = None
        result["region"] = "Asia" if result["country"] in {"Indonesia", "Philippines", "Vanuatu", "Papua New Guinea", "Fiji", "Tonga", "New Zealand", "India", "Iran", "Turkey", "Greece", "Ethiopia", "Russia", "Japan"} else None
    elif re.search(r"\b(puerto rico|virgin islands|dominican republic|cuba|jamaica|haiti)\b", lower):
        result["country"] = "Puerto Rico" if "puerto rico" in lower else "Dominican Republic" if "dominican republic" in lower else "Cuba" if "cuba" in lower else "Jamaica" if "jamaica" in lower else "Haiti" if "haiti" in lower else None
        result["country_code"] = "PR" if result["country"] == "Puerto Rico" else None
        result["region"] = "Caribbean"

    if result["country"]:
        result["place_reference"] = text
        if re.search(r"\b(near|of|nw of|nnw of|ne of|ene of|ese of|sw of|ssw of|se of|s of|w of|e of|n of|sse of|wnw of|wsw of|ese of|ene of)\b", lower):
            result["place_direction"] = "relative"

    country = result["country"]
    if country == "United States":
        result["city"] = "Alaska" if "alaska" in lower else "Hawaii" if "hawaii" in lower else None
        result["nearest_city"] = result["city"]
    elif country == "Mexico":
        result["city"] = None
    elif country == "Colombia":
        result["city"] = "San José del Palmar" if "san josé del palmar" in lower else None
        result["nearest_city"] = result["city"]
    elif country == "Peru":
        result["city"] = None
    elif country == "Indonesia":
        result["city"] = "Pagar Alam" if "pagar alam" in lower else None
        result["nearest_city"] = result["city"]
    elif country == "Philippines":
        result["city"] = "San Miguel" if "san miguel" in lower else None
        result["nearest_city"] = result["city"]
    elif country == "Vanuatu":
        result["city"] = "Sola" if "sola" in lower else "Isangel" if "isangel" in lower else None
        result["nearest_city"] = result["city"]
    elif country == "Papua New Guinea":
        result["city"] = "Panguna" if "panguna" in lower else None
        result["nearest_city"] = result["city"]
    elif country == "Fiji":
        result["city"] = "Levuka" if "levuka" in lower else None
        result["nearest_city"] = result["city"]
    elif country == "Tonga":
        result["city"] = None
    elif country == "New Zealand":
        result["city"] = "Hicks Bay" if "hicks bay" in lower else None
        result["nearest_city"] = result["city"]
    elif country == "India":
        result["city"] = "Barkot" if "barkot" in lower else None
        result["nearest_city"] = result["city"]
    elif country == "Iran":
        result["city"] = "Shahrak-e Kūlūrī" if "shahrak-e kūlūrī" in lower else None
        result["nearest_city"] = result["city"]
    elif country == "Turkey":
        result["city"] = "Nurdağı" if "nurdağı" in lower else None
        result["nearest_city"] = result["city"]
    elif country == "Greece":
        result["city"] = "Antikyra" if "antikyra" in lower else None
        result["nearest_city"] = result["city"]
    elif country == "Ethiopia":
        result["city"] = "Metahāra" if "metahāra" in lower else None
        result["nearest_city"] = result["city"]
    elif country == "Russia":
        result["city"] = "Shikotan" if "shikotan" in lower else None
        result["nearest_city"] = result["city"]
    elif country == "Puerto Rico":
        result["city"] = "Peñuelas" if "peñuelas" in lower else "Charlotte Amalie" if "charlotte amalie" in lower else "San Antonio" if "san antonio" in lower else None
        result["nearest_city"] = result["city"]
    elif country == "Dominican Republic":
        result["city"] = "Samaná" if "samana" in lower else None
        result["nearest_city"] = result["city"]

    return result


def transform_rows(rows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    transformed: List[Dict[str, Any]] = []
    for row in rows:
        magnitude = row.get("magnitude")
        depth_km = row.get("depth_km")
        event_time_utc = row.get("event_time_utc")
        if isinstance(event_time_utc, str):
            try:
                event_time_utc = datetime.fromisoformat(event_time_utc)
            except ValueError:
                event_time_utc = None

        if event_time_utc is not None and event_time_utc.tzinfo is None:
            event_time_utc = event_time_utc.replace(tzinfo=timezone.utc)

        transformed_row = dict(row)
        transformed_row["magnitude_band"] = build_magnitude_band(magnitude)
        transformed_row["depth_band"] = build_depth_band(depth_km)
        transformed_row["analytical_score"] = build_analytical_score(transformed_row)
        transformed_row["analytical_severity"] = build_analytical_severity(magnitude)
        transformed_row["event_time_utc"] = event_time_utc
        transformed_row["event_date"] = event_time_utc.date().isoformat() if event_time_utc else None
        transformed_row["event_time"] = event_time_utc.time().isoformat() if event_time_utc else None
        transformed_row["event_hour"] = event_time_utc.hour if event_time_utc else None
        transformed_row["event_minute"] = event_time_utc.minute if event_time_utc else None
        transformed_row["day_of_week"] = event_time_utc.weekday() + 1 if event_time_utc else None
        transformed_row["day_of_month"] = event_time_utc.day if event_time_utc else None
        transformed_row["week"] = event_time_utc.isocalendar().week if event_time_utc else None
        transformed_row["month"] = event_time_utc.month if event_time_utc else None
        transformed_row["month_name"] = event_time_utc.strftime("%B") if event_time_utc else None
        transformed_row["quarter"] = (event_time_utc.month - 1) // 3 + 1 if event_time_utc else None
        transformed_row["year"] = event_time_utc.year if event_time_utc else None
        transformed_row["timezone"] = None
        transformed_row["event_time_local"] = None
        transformed_row["geo_source"] = "place_text"
        transformed_row["geo_enrichment_timestamp"] = None
        transformed_row["anomaly_flag"] = None
        transformed_row["anomaly_reason"] = None
        geography = infer_geography_from_place(row.get("place_raw"))
        transformed_row["country"] = geography["country"]
        transformed_row["country_code"] = geography["country_code"]
        transformed_row["region"] = geography["region"]
        transformed_row["admin1"] = geography["admin1"]
        transformed_row["city"] = geography["city"]
        transformed_row["nearest_city"] = geography["nearest_city"]
        transformed_row["distance_to_city_km"] = None
        transformed_row["tectonic_region"] = None
        transformed_row["place_distance_km"] = None
        transformed_row["place_direction"] = None
        transformed_row["place_reference"] = None
        transformed_row["data_quality_flag"] = "VALID"
        transformed_row["data_quality_reason"] = None
        transformed_row["duplicate_flag"] = False
        transformed.append(transformed_row)
    return transformed
