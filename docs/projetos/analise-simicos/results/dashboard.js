const regionFilter = document.getElementById('regionFilter');
const countryFilter = document.getElementById('countryFilter');
const yearFilter = document.getElementById('yearFilter');
const monthFilter = document.getElementById('monthFilter');
const dayFilter = document.getElementById('dayFilter');
const datasetModeFilter = document.getElementById('datasetModeFilter');
const resetButton = document.getElementById('resetFilters');
const refreshButton = document.getElementById('refreshData');
const exportButton = document.getElementById('exportData');

const trendChartEl = document.getElementById('trendChart');
const magnitudeChartEl = document.getElementById('magnitudeChart');
const scatterChartEl = document.getElementById('scatterChart');
const depthChartEl = document.getElementById('depthChart');

const kpiEvents = document.getElementById('kpiEvents');
const kpiM4 = document.getElementById('kpiM4');
const kpiM5 = document.getElementById('kpiM5');
const kpiMaxMag = document.getElementById('kpiMaxMag');
const kpiMedianDepth = document.getElementById('kpiMedianDepth');
const kpiLastDate = document.getElementById('kpiLastDate');
const summaryText = document.getElementById('summaryText');
const topRegion = document.getElementById('topRegion');
const topCountry = document.getElementById('topCountry');
const topMagnitude = document.getElementById('topMagnitude');
const detailsTable = document.getElementById('detailsTable');
const detailsLimit = document.getElementById('detailsLimit');
const lastUpdatedEl = document.getElementById('lastUpdated');
const dataSourceEl = document.getElementById('dataSource');
const recordsLoadedEl = document.getElementById('recordsLoaded');
const dateRangeEl = document.getElementById('dateRange');
const insightHighestEl = document.getElementById('insightHighest');
const insightHighestMetaEl = document.getElementById('insightHighestMeta');
const insightRegionEl = document.getElementById('insightRegion');
const insightRegionMetaEl = document.getElementById('insightRegionMeta');
const insightMagnitudeBandEl = document.getElementById('insightMagnitudeBand');
const insightMagnitudeMetaEl = document.getElementById('insightMagnitudeMeta');
const insightTemporalEl = document.getElementById('insightTemporal');
const insightTemporalMetaEl = document.getElementById('insightTemporalMeta');
const attentionListEl = document.getElementById('attentionList');
const topSummaryEl = document.getElementById('topSummary');
const answerListEl = document.getElementById('answerList');
const executiveSignalMainEl = document.getElementById('executiveSignalMain');
const executiveSignalMetaEl = document.getElementById('executiveSignalMeta');

const DASHBOARD_START_TIME = '2026-01-01';
const DASHBOARD_END_TIME = '2026-12-31';
const DASHBOARD_HISTORY_LIMIT = 20000;
const DASHBOARD_LATEST_LIMIT = 100;
const DASHBOARD_24H_LIMIT = 5000;
const DASHBOARD_7D_LIMIT = 20000;
const CONTINENTS = [
  { name: 'Africa', code: 'AF' },
  { name: 'Antarctica', code: 'AN' },
  { name: 'Asia', code: 'AS' },
  { name: 'Europe', code: 'EU' },
  { name: 'North America', code: 'NA' },
  { name: 'South America', code: 'SA' },
  { name: 'Oceania', code: 'OC' },
];
const CONTINENT_NAMES = CONTINENTS.map(item => item.name);
const UNKNOWN_REGION = 'Oceania';
const UNKNOWN_COUNTRY = 'Águas internacionais';
const US_STATE_CODES = new Set(['AK', 'AL', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY']);
const US_STATE_NAMES = new Set(['alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut', 'delaware', 'florida', 'georgia', 'hawaii', 'idaho', 'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota', 'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 'new hampshire', 'new jersey', 'new mexico', 'new york', 'north carolina', 'north dakota', 'ohio', 'oklahoma', 'oregon', 'pennsylvania', 'rhode island', 'south carolina', 'south dakota', 'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington', 'west virginia', 'wisconsin', 'wyoming']);
const COUNTRY_ALIASES = {
  us: 'Estados Unidos',
  usa: 'Estados Unidos',
  'united states': 'Estados Unidos',
  mx: 'México',
  mexico: 'México',
  br: 'Brasil',
  brazil: 'Brasil',
  co: 'Colômbia',
  colombia: 'Colômbia',
  jp: 'Japão',
  japan: 'Japão',
  ru: 'Rússia',
  russia: 'Rússia',
  id: 'Indonesia',
  indonesia: 'Indonesia',
  ir: 'Irã',
  iran: 'Irã',
};
const COUNTRY_TO_CONTINENT = {
  'Estados Unidos': 'North America',
  'México': 'North America',
  'Canadá': 'North America',
  'Colômbia': 'South America',
  'Brasil': 'South America',
  'Peru': 'South America',
  'Chile': 'South America',
  'Argentina': 'South America',
  'Equador': 'South America',
  'Bolívia': 'South America',
  'Paraguai': 'South America',
  'Uruguai': 'South America',
  'Venezuela': 'South America',
  'Indonesia': 'Asia',
  'Irã': 'Asia',
  'Japão': 'Asia',
  'Rússia': 'Asia',
  'China': 'Asia',
  'Filipinas': 'Asia',
  'Turquia': 'Asia',
  'Índia': 'Asia',
  'Fiji': 'Oceania',
  'Vanuatu': 'Oceania',
  'Papua New Guinea': 'Oceania',
  'New Zealand': 'Oceania',
  'Águas internacionais': 'Oceania',
};

const COUNTRY_PATTERNS = [
  { regex: /\b(united states|u\.s\.|usa|alaska|hawaii|california|nevada|montana|washington|oregon|idaho|oklahoma|texas|puerto rico|virgin islands)\b/i, country: 'Estados Unidos', region: 'North America' },
  { regex: /\b(mexico|baja california)\b/i, country: 'México', region: 'North America' },
  { regex: /\b(canada|british columbia|yukon)\b/i, country: 'Canadá', region: 'North America' },
  { regex: /\b(colombia|peru|chile|argentina|brazil|ecuador|bolivia|paraguay|uruguay|venezuela)\b/i, country: null, region: 'South America' },
  { regex: /\b(indonesia|philippines|japan|iran|turkey|india|russia|china|pakistan|afghanistan)\b/i, country: null, region: 'Asia' },
  { regex: /\b(greece|italy|spain|portugal|iceland)\b/i, country: null, region: 'Europe' },
  { regex: /\b(ethiopia|kenya|tanzania|morocco|algeria)\b/i, country: null, region: 'Africa' },
  { regex: /\b(new zealand|fiji|tonga|vanuatu|papua new guinea|solomon islands)\b/i, country: null, region: 'Oceania' },
  { regex: /\b(atlantic ocean|pacific ocean|indian ocean|caribbean sea|mediterranean sea|sea of)\b/i, country: 'Águas internacionais', region: 'Oceania' },
];

function getDashboardData() {
  if (window.dashboardData && Array.isArray(window.dashboardData)) {
    return window.dashboardData;
  }
  if (typeof data !== 'undefined' && Array.isArray(data)) {
    return data;
  }
  return [];
}

function getStaticDashboardData() {
  if (typeof data !== 'undefined' && Array.isArray(data)) {
    return data;
  }
  return [];
}

function titleCaseWord(value) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function inferCountryRegionFromPlace(place) {
  if (!place) {
    return { country: UNKNOWN_COUNTRY, region: UNKNOWN_REGION };
  }

  const text = String(place).trim();
  const lowerText = text.toLowerCase();
  for (const stateName of US_STATE_NAMES) {
    if (lowerText.includes(stateName)) {
      return { country: 'Estados Unidos', region: 'North America' };
    }
  }

  for (const pattern of COUNTRY_PATTERNS) {
    if (pattern.regex.test(text)) {
      const matched = text.match(pattern.regex);
      const token = matched ? matched[0] : null;
      const country = pattern.country || (token ? titleCaseWord(token) : UNKNOWN_COUNTRY);
      const normalizedCountry = country
        .replace(/^Usa$/i, 'Estados Unidos')
        .replace(/^United states$/i, 'Estados Unidos')
        .replace(/^U\.s\.$/i, 'Estados Unidos')
        .replace(/^Brazil$/i, 'Brasil')
        .replace(/^Colombia$/i, 'Colômbia')
        .replace(/^Peru$/i, 'Peru')
        .replace(/^Mexico$/i, 'México')
        .replace(/^Canada$/i, 'Canadá');
      return { country: normalizedCountry, region: pattern.region || UNKNOWN_REGION };
    }
  }

  const parts = text.split(',').map(item => item.trim()).filter(Boolean);
  if (parts.length >= 2) {
    const lastPart = parts[parts.length - 1];
    if (US_STATE_CODES.has(lastPart.toUpperCase())) {
      return { country: 'Estados Unidos', region: 'North America' };
    }

    const codeKey = lastPart.toLowerCase();
    if (COUNTRY_ALIASES[codeKey]) {
      const country = COUNTRY_ALIASES[codeKey];
      if (country === 'Estados Unidos' || country === 'México' || country === 'Canadá') {
        return { country, region: 'North America' };
      }
      return { country, region: UNKNOWN_REGION };
    }

    if (/\b(ocean|sea|ridge|trench|junction|region)\b/i.test(text)) {
      return { country: 'Águas internacionais', region: 'Oceania' };
    }

    if (/^[A-Za-z\s\-\.]+$/.test(lastPart) && lastPart.length <= 25) {
      return { country: titleCaseWord(lastPart), region: UNKNOWN_REGION };
    }
  }

  return { country: UNKNOWN_COUNTRY, region: UNKNOWN_REGION };
}

function normalizeGeoValue(value, fallback) {
  if (!value) return fallback;
  const text = String(value).trim();
  if (!text || /^outros$/i.test(text) || /^none$/i.test(text) || /^null$/i.test(text)) {
    return fallback;
  }
  return text;
}

function normalizeCountryValue(rawCountry, inferredCountry, place) {
  const raw = String(rawCountry || '').trim();
  const key = raw.toLowerCase();

  if (!raw || /^outros$/i.test(raw) || /^none$/i.test(raw) || /^null$/i.test(raw)) {
    if (inferredCountry) {
      const inferredKey = String(inferredCountry).toLowerCase();
      return COUNTRY_ALIASES[inferredKey] || inferredCountry;
    }
    return UNKNOWN_COUNTRY;
  }

  if (US_STATE_CODES.has(raw.toUpperCase()) || US_STATE_NAMES.has(key)) {
    return 'Estados Unidos';
  }

  if (COUNTRY_ALIASES[key]) {
    return COUNTRY_ALIASES[key];
  }

  if (raw.length <= 2 && inferredCountry) {
    return inferredCountry;
  }

  if (/\b(ocean|sea|ridge|trench|junction|region)\b/i.test(String(place || ''))) {
    return 'Águas internacionais';
  }

  return raw;
}

function normalizeRegionValue(rawRegion, country, inferredRegion) {
  const raw = normalizeGeoValue(rawRegion, inferredRegion || UNKNOWN_REGION);
  const alias = {
    'América do Norte': 'North America',
    'América do Sul': 'South America',
    'Ásia': 'Asia',
    'Europa': 'Europe',
    'África': 'Africa',
    'Oceano': 'Oceania',
  };

  const normalized = alias[raw] || raw;
  if (CONTINENT_NAMES.includes(normalized)) {
    return normalized;
  }

  if (COUNTRY_TO_CONTINENT[country]) {
    return COUNTRY_TO_CONTINENT[country];
  }

  if (inferredRegion && CONTINENT_NAMES.includes(inferredRegion)) {
    return inferredRegion;
  }

  return UNKNOWN_REGION;
}

function populateSelect(select, values, sortMode = 'alpha') {
  const uniqueValues = [...new Set(values.filter(Boolean))];
  if (sortMode === 'numeric') {
    uniqueValues.sort((a, b) => Number(a) - Number(b));
  } else {
    uniqueValues.sort((a, b) => String(a).localeCompare(String(b), 'pt-BR'));
  }
  select.innerHTML = '<option value="">Todos</option>';

  if (!uniqueValues.length) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'Sem dados';
    select.appendChild(option);
    return;
  }

  uniqueValues.forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function populateRegionFilter() {
  regionFilter.innerHTML = '<option value="">Todos</option>';
  CONTINENTS.forEach(item => {
    const option = document.createElement('option');
    option.value = item.name;
    option.textContent = `${item.name} (${item.code})`;
    regionFilter.appendChild(option);
  });
}

function getDataFilteredByNonGeoDimensions(rows) {
  const year = yearFilter.value;
  const month = monthFilter.value;
  const day = dayFilter.value;
  return rows.filter(item => {
    const date = new Date(item.date);
    const matchesYear = !year || date.getFullYear() === Number(year);
    const matchesMonth = !month || (date.getMonth() + 1) === Number(month);
    const matchesDay = !day || date.getDate() === Number(day);
    return matchesYear && matchesMonth && matchesDay;
  });
}

function refreshCountryFilterOptions() {
  const dashboardData = getDashboardData();
  const selectedRegion = regionFilter.value;
  const rowsByDate = getDataFilteredByNonGeoDimensions(dashboardData);
  const candidates = rowsByDate.filter(item => !selectedRegion || item.region === selectedRegion);
  const selectedCountry = countryFilter.value;
  populateSelect(countryFilter, candidates.map(item => normalizeGeoValue(item.country, UNKNOWN_COUNTRY)));
  if (selectedCountry && Array.from(countryFilter.options).some(opt => opt.value === selectedCountry)) {
    countryFilter.value = selectedCountry;
  }
}

function populateDataFilters() {
  const dashboardData = getDashboardData();
  const selectedRegion = regionFilter.value;
  const selectedCountry = countryFilter.value;
  populateRegionFilter();
  if (selectedRegion && CONTINENT_NAMES.includes(selectedRegion)) {
    regionFilter.value = selectedRegion;
  }
  populateSelect(yearFilter, dashboardData.map(item => new Date(item.date).getFullYear().toString()), 'numeric');
  populateSelect(monthFilter, dashboardData.map(item => (new Date(item.date).getMonth() + 1).toString()), 'numeric');
  populateSelect(dayFilter, dashboardData.map(item => new Date(item.date).getDate().toString()), 'numeric');
  refreshCountryFilterOptions();
  if (selectedCountry && Array.from(countryFilter.options).some(opt => opt.value === selectedCountry)) {
    countryFilter.value = selectedCountry;
  }
}

function getIsoUtcFromNow(daysBack = 0) {
  const dt = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
  return dt.toISOString();
}

function getDatasetModeLabel(mode) {
  if (mode === 'latest_24h') return 'últimas 24h';
  if (mode === 'latest_7d') return 'últimos 7 dias';
  if (mode === 'historical_2026') return 'histórico 2026';
  return 'últimos 100';
}

function getMedian(values) {
  if (!values.length) return 0;
  const sorted = values.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function filterRowsByMode(rows, mode) {
  if (!rows.length) return [];

  const sortedDesc = rows
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (mode === 'latest_100') {
    return sortedDesc.slice(0, DASHBOARD_LATEST_LIMIT);
  }

  if (mode === 'historical_2026') {
    return rows.filter(item => item.date >= DASHBOARD_START_TIME && item.date <= DASHBOARD_END_TIME);
  }

  const maxDate = sortedDesc.length ? new Date(sortedDesc[0].date) : new Date();
  const daysBack = mode === 'latest_24h' ? 1 : 7;
  const floorDate = new Date(maxDate.getTime() - daysBack * 24 * 60 * 60 * 1000);
  return rows.filter(item => new Date(item.date) >= floorDate && new Date(item.date) <= maxDate);
}

function resetDimensionFilters() {
  [regionFilter, countryFilter, yearFilter, monthFilter, dayFilter].forEach(select => {
    select.value = '';
  });
}

function getFilteredData() {
  const dashboardData = getDashboardData();
  const region = regionFilter.value;
  const country = countryFilter.value;
  const year = yearFilter.value;
  const month = monthFilter.value;
  const day = dayFilter.value;

  return dashboardData.filter(item => {
    const date = new Date(item.date);
    const itemRegion = normalizeGeoValue(item.region, UNKNOWN_REGION);
    const itemCountry = normalizeGeoValue(item.country, UNKNOWN_COUNTRY);
    const matchesRegion = !region || itemRegion === region;
    const matchesCountry = !country || itemCountry === country;
    const matchesYear = !year || date.getFullYear() === Number(year);
    const matchesMonth = !month || (date.getMonth() + 1) === Number(month);
    const matchesDay = !day || date.getDate() === Number(day);
    return matchesRegion && matchesCountry && matchesYear && matchesMonth && matchesDay;
  });
}

function getSeverityLabel(magnitude) {
  if (magnitude >= 7) return 'CRITICA';
  if (magnitude >= 6) return 'ALTA';
  if (magnitude >= 5) return 'SIGNIFICATIVA';
  if (magnitude >= 4) return 'MODERADA';
  return 'BAIXA';
}

function getTrendStatus(filtered) {
  if (!filtered.length) return 'indisponível';
  const dates = [...new Set(filtered.map(item => item.date))].sort();
  if (dates.length < 2) return 'estável';
  const midpoint = Math.floor(dates.length / 2);
  const firstHalf = filtered.filter(item => item.date <= dates[midpoint - 1] || dates.length === 2 && item.date <= dates[0]).length;
  const secondHalf = filtered.filter(item => item.date >= dates[midpoint]).length;
  if (secondHalf > firstHalf * 1.15) return 'em alta';
  if (secondHalf < firstHalf * 0.85) return 'em queda';
  return 'estável';
}

function getCorrelation(filtered) {
  if (filtered.length < 2) return 0;
  const mags = filtered.map(item => item.mag);
  const depths = filtered.map(item => item.depth);
  const meanMag = mags.reduce((sum, value) => sum + value, 0) / mags.length;
  const meanDepth = depths.reduce((sum, value) => sum + value, 0) / depths.length;
  const numerator = mags.reduce((sum, mag, index) => sum + (mag - meanMag) * (depths[index] - meanDepth), 0);
  const denominator = Math.sqrt(mags.reduce((sum, mag) => sum + Math.pow(mag - meanMag, 2), 0) * depths.reduce((sum, depth) => sum + Math.pow(depth - meanDepth, 2), 0));
  return denominator ? numerator / denominator : 0;
}

function getSeverityClass(label) {
  if (label === 'CRITICA') return 'severity-major';
  if (label === 'ALTA') return 'severity-high';
  if (label === 'SIGNIFICATIVA') return 'severity-significant';
  if (label === 'MODERADA') return 'severity-moderate';
  return 'severity-low';
}

function getSeismicScore(item) {
  const magnitudeBonus = item.mag * 8;
  const depthBonus = item.depth < 50 ? 12 : item.depth < 100 ? 6 : 0;
  const tsunamiBonus = item.tsunami ? 18 : 0;
  const alertBonus = item.alert ? 10 : 0;
  const significanceBonus = Math.min(20, (item.significance || 0) / 10);
  return Math.min(100, Math.round(magnitudeBonus + depthBonus + tsunamiBonus + alertBonus + significanceBonus));
}

function updateDashboard() {
  const filtered = getFilteredData();
  const dashboardData = getDashboardData();
  if (!filtered.length) {
    kpiEvents.textContent = '0';
    kpiM4.textContent = '0';
    kpiM5.textContent = '0';
    kpiMaxMag.textContent = '0.0';
    kpiMedianDepth.textContent = '0.0';
    kpiLastDate.textContent = '—';
    topRegion.textContent = '—';
    topCountry.textContent = '—';
    topMagnitude.textContent = '—';
    summaryText.innerHTML = '<strong>Sem dados para esta seleção.</strong>';
    renderCharts([], [], [], []);
    renderDetails([]);
    return;
  }

  const count = filtered.length;
  const m4Events = filtered.filter(item => item.mag >= 4).length;
  const m5Events = filtered.filter(item => item.mag >= 5).length;
  const maxMag = filtered.reduce((max, item) => item.mag > max ? item.mag : max, 0);
  const medianDepth = getMedian(filtered.map(item => item.depth));
  const medianMag = getMedian(filtered.map(item => item.mag)).toFixed(1);
  const medianDepthAll = getMedian(filtered.map(item => item.depth)).toFixed(1);
  const lastDate = filtered.slice().sort((a, b) => new Date(b.date) - new Date(a.date))[0].date;

  kpiEvents.textContent = count;
  kpiM4.textContent = m4Events;
  kpiM5.textContent = m5Events;
  kpiMaxMag.textContent = maxMag.toFixed(1);
  kpiMedianDepth.textContent = medianDepth.toFixed(1);
  kpiLastDate.textContent = lastDate;

  const regionCounts = Object.entries(filtered.reduce((acc, item) => {
    const region = normalizeGeoValue(item.region, UNKNOWN_REGION);
    acc[region] = (acc[region] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]);

  const countryCounts = Object.entries(filtered.reduce((acc, item) => {
    const country = normalizeGeoValue(item.country, UNKNOWN_COUNTRY);
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]);

  const trendCounts = Object.entries(filtered.reduce((acc, item) => {
    acc[item.date] = (acc[item.date] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => a[0].localeCompare(b[0]));

  const topRegionItem = regionCounts[0] ? regionCounts[0][0] : '—';
  const topCountryItem = countryCounts[0] ? countryCounts[0][0] : '—';
  const topMagnitudeItem = filtered.reduce((max, item) => item.mag > max.mag ? item : max, filtered[0]).mag.toFixed(1);
  const topMagnitudePlace = filtered.reduce((max, item) => item.mag > max.mag ? item : max, filtered[0]).place;
  const topEvent = filtered.reduce((max, item) => getSeismicScore(item) > getSeismicScore(max) ? item : max, filtered[0]);
  const trendStatus = getTrendStatus(filtered);
  const correlation = getCorrelation(filtered);
  const correlationLabel = correlation > 0.3 ? 'positiva' : correlation < -0.3 ? 'negativa' : 'fraca';
  const regionIntensity = regionCounts.map(([name, count]) => {
    const regionEvents = filtered.filter(item => item.region === name);
    return {
      name,
      count,
      medianMagnitude: getMedian(regionEvents.map(item => item.mag))
    };
  }).sort((a, b) => b.medianMagnitude - a.medianMagnitude);
  const mostIntenseRegion = regionIntensity[0] || { name: '—', count: 0, medianMagnitude: 0 };

  const magnitudeBands = ['<2', '2–3', '3–4', '4–5', '5–6', '6–7', '7+'];
  const magnitudeValues = magnitudeBands.map((band) => {
    if (band === '<2') return filtered.filter(item => item.mag < 2).length;
    if (band === '2–3') return filtered.filter(item => item.mag >= 2 && item.mag < 3).length;
    if (band === '3–4') return filtered.filter(item => item.mag >= 3 && item.mag < 4).length;
    if (band === '4–5') return filtered.filter(item => item.mag >= 4 && item.mag < 5).length;
    if (band === '5–6') return filtered.filter(item => item.mag >= 5 && item.mag < 6).length;
    if (band === '6–7') return filtered.filter(item => item.mag >= 6 && item.mag < 7).length;
    return filtered.filter(item => item.mag >= 7).length;
  });

  const depthBands = ['0–10 km', '10–50 km', '50–100 km', '100–300 km', '300+ km'];
  const depthValues = depthBands.map((band) => {
    if (band === '0–10 km') return filtered.filter(item => item.depth >= 0 && item.depth < 10).length;
    if (band === '10–50 km') return filtered.filter(item => item.depth >= 10 && item.depth < 50).length;
    if (band === '50–100 km') return filtered.filter(item => item.depth >= 50 && item.depth < 100).length;
    if (band === '100–300 km') return filtered.filter(item => item.depth >= 100 && item.depth < 300).length;
    return filtered.filter(item => item.depth >= 300).length;
  });

  const dayValues = filtered.map(item => item.date).sort();
  const distinctDays = [...new Set(dayValues)];
  const temporalInsight = distinctDays.length >= 2 ? `${distinctDays.length} dias no intervalo selecionado` : 'amostra de um único dia';
  const magnitudeProfile = magnitudeValues.reduce((maxIndex, value, index) => value > magnitudeValues[maxIndex] ? index : maxIndex, 0);
  const dominantBand = magnitudeBands[magnitudeProfile];
  const dominantBandCount = magnitudeValues[magnitudeProfile];
  const m6Events = filtered.filter(item => item.mag >= 6).length;
  const m7Events = filtered.filter(item => item.mag >= 7).length;
  const tsunamiEvents = filtered.filter(item => item.tsunami).length;
  const alertEvents = filtered.filter(item => item.alert).length;
  const significantEvents = filtered.filter(item => (item.significance || 0) >= 100).length;
  const hourlySpread = filtered.reduce((acc, item) => {
    const hour = new Date(item.date).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {});
  const dominantHour = Object.entries(hourlySpread).sort((a, b) => b[1] - a[1])[0];
  const hourlyLabel = dominantHour ? `${dominantHour[0]}h` : '—';

  topRegion.textContent = topRegionItem;
  topCountry.textContent = topCountryItem;
  topMagnitude.textContent = `${topMagnitudeItem} (${topMagnitudePlace})`;

  const regionShare = count ? ((regionCounts[0] ? regionCounts[0][1] : 0) / count * 100).toFixed(0) : 0;
  const geographicLabel = topRegionItem === 'Outros' && topCountryItem === 'Outros'
    ? 'a classificação geográfica do catálogo permanece agregada'
    : `${topRegionItem} como principal concentração regional e ${topCountryItem} como principal país da seleção`;

  summaryText.innerHTML = `<strong>Severidade Analítica:</strong> ${getSeverityLabel(maxMag)} • ${count} eventos • profundidade mediana ${medianDepth.toFixed(1)} km • ${geographicLabel}.`;
  topSummaryEl.innerHTML = `<strong>${topRegionItem}</strong> concentra ${regionCounts[0] ? regionCounts[0][1] : 0} eventos, o que representa ${regionShare}% da seleção, e o maior evento registrado atingiu magnitude ${topMagnitudeItem} em ${topMagnitudePlace}.`;
  if (executiveSignalMainEl) {
    executiveSignalMainEl.textContent = `${topRegionItem} é o centro da seleção • ${count} eventos monitorados`;
  }
  if (executiveSignalMetaEl) {
    executiveSignalMetaEl.textContent = `Maior evento: ${topMagnitudePlace} (M ${topMagnitudeItem}) • tendência ${trendStatus} • ${m6Events} eventos M6+`;
  }

  insightHighestEl.textContent = `${maxMag.toFixed(1)} M`; 
  insightHighestMetaEl.textContent = `${topMagnitudePlace} • ${lastDate} • ${m7Events} eventos M7+`;
  insightRegionEl.textContent = `${topRegionItem}`;
  insightRegionMetaEl.textContent = `${regionCounts[0] ? regionCounts[0][1] : 0} eventos • ${((regionCounts[0] ? regionCounts[0][1] : 0) / count * 100).toFixed(0)}% do total`;
  insightMagnitudeBandEl.textContent = dominantBand;
  insightMagnitudeMetaEl.textContent = `${dominantBandCount} eventos • ${m6Events} M6+ • ${m7Events} M7+`;
  insightTemporalEl.textContent = temporalInsight;
  insightTemporalMetaEl.textContent = `magnitude mediana ${medianMag} • profundidade mediana ${medianDepthAll} km • pico horário ${hourlyLabel}`;

  lastUpdatedEl.textContent = `Última atualização: ${new Date().toLocaleString('pt-BR')}`;
  if (window.dashboardSource === 'api') {
    const modeLabel = getDatasetModeLabel(window.dashboardMode);
    dataSourceEl.textContent = `Fonte: USGS Earthquake Catalog (ao vivo) • ${modeLabel}`;
  } else {
    dataSourceEl.textContent = 'Fonte: dados locais / fallback';
  }
  recordsLoadedEl.textContent = `Eventos carregados: ${dashboardData.length}`;
  const minDate = dayValues[0] || '—';
  dateRangeEl.textContent = `Período: ${minDate} → ${lastDate}`;

  answerListEl.innerHTML = `
    <div class="answer-item"><strong>Onde acontecem?</strong><br>A maior concentração da seleção está em ${topRegionItem}; ${topCountryItem} aparece como o principal agrupamento geográfico dentro do contexto analisado.</div>
    <div class="answer-item"><strong>Quais são os mais relevantes?</strong><br>O evento de maior relevância analítica foi ${topEvent.place}, com magnitude ${topEvent.mag.toFixed(1)}, score ${getSeismicScore(topEvent)} e severidade ${getSeverityLabel(topEvent.mag)}.</div>
    <div class="answer-item"><strong>A atividade está aumentando ou diminuindo?</strong><br>A tendência observada é ${trendStatus} ao longo do intervalo analisado, com ${distinctDays.length} dias registrados e pico horário ${hourlyLabel}.</div>
    <div class="answer-item"><strong>Existe relação entre magnitude e profundidade?</strong><br>A correlação estimada é ${correlationLabel} (${correlation.toFixed(2)}), o que sugere ${correlation > 0.3 ? 'uma leve tendência de eventos mais fortes em maiores profundidades' : correlation < -0.3 ? 'uma leve tendência de eventos mais fortes em menores profundidades' : 'pouca relação linear entre magnitude e profundidade'}.</div>
    <div class="answer-item"><strong>Quais regiões apresentam maior intensidade?</strong><br>${mostIntenseRegion.name} registrou a maior magnitude mediana da seleção: ${mostIntenseRegion.medianMagnitude.toFixed(1)} M em ${mostIntenseRegion.count} eventos.</div>
    <div class="answer-item"><strong>Há sinais de eventos críticos?</strong><br>Há ${m6Events} eventos M6+, ${m7Events} eventos M7+, ${tsunamiEvents} com tsunami e ${alertEvents} com alerta, além de ${significantEvents} eventos de alta significância.</div>
  `;

  const attentionItems = filtered.filter(item => item.mag >= 5 || item.tsunami || item.alert || item.mag >= 6 || (item.significance || 0) >= 50)
    .sort((a, b) => b.mag - a.mag)
    .slice(0, 5);
  attentionListEl.innerHTML = attentionItems.length ? attentionItems.map(item => {
    const severity = getSeverityLabel(item.mag);
    return `<div class="attention-item"><strong>${item.place}</strong><br><small>${item.date} • M ${item.mag.toFixed(1)} • ${item.country}</small><br><span class="severity-pill ${getSeverityClass(severity)}">${severity}</span></div>`;
  }).join('') : '<div class="attention-item"><strong>Nenhum evento crítico na seleção atual.</strong></div>';

  renderCharts(trendCounts, filtered, magnitudeBands, magnitudeValues, depthBands, depthValues);
  renderDetails(filtered);
}

function createSvgElement(tag, attrs = {}) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

function renderBarChart(container, labels, values) {
  container.innerHTML = '';
  const svg = createSvgElement('svg', { viewBox: '0 0 320 220' });
  const maxValue = Math.max(...values, 1);
  const colors = ['#7c3aed', '#16a34a', '#f59e0b', '#0ea5e9', '#ef4444'];

  const chartHeight = 150;
  const chartWidth = 280;
  const paddingLeft = 30;
  const paddingBottom = 40;
  const barWidth = 40;
  const gap = 18;

  svg.appendChild(createSvgElement('line', { x1: paddingLeft, y1: 20, x2: paddingLeft, y2: chartHeight + 20, stroke: 'rgba(255,255,255,0.3)', 'stroke-width': 1 }));
  svg.appendChild(createSvgElement('line', { x1: paddingLeft, y1: chartHeight + 20, x2: paddingLeft + chartWidth, y2: chartHeight + 20, stroke: 'rgba(255,255,255,0.3)', 'stroke-width': 1 }));

  labels.forEach((label, index) => {
    const value = values[index];
    const barHeight = (value / maxValue) * chartHeight;
    const x = paddingLeft + index * (barWidth + gap);
    const y = chartHeight + 20 - barHeight;
    const rect = createSvgElement('rect', { x, y, width: barWidth, height: barHeight, rx: 6, fill: colors[index % colors.length] });
    svg.appendChild(rect);

    const labelText = createSvgElement('text', { x: x + barWidth / 2, y: chartHeight + 40, 'text-anchor': 'middle', fill: 'rgba(255,255,255,0.8)', 'font-size': '10' });
    labelText.textContent = label;
    svg.appendChild(labelText);

    const valueText = createSvgElement('text', { x: x + barWidth / 2, y: y - 6, 'text-anchor': 'middle', fill: 'white', 'font-size': '10' });
    valueText.textContent = value;
    svg.appendChild(valueText);
  });

  container.appendChild(svg);
}

function renderLineChart(container, labels, values) {
  container.innerHTML = '';
  const svg = createSvgElement('svg', { viewBox: '0 0 320 220' });
  const maxValue = Math.max(...values, 1);
  const paddingLeft = 25;
  const paddingBottom = 35;
  const chartHeight = 150;
  const chartWidth = 280;
  const step = chartWidth / Math.max(labels.length - 1, 1);

  const points = values.map((value, index) => {
    const x = paddingLeft + index * step;
    const y = chartHeight + 20 - (value / maxValue) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  svg.appendChild(createSvgElement('polyline', { points, fill: 'none', stroke: '#7c3aed', 'stroke-width': 3 }));
  svg.appendChild(createSvgElement('path', { d: `M ${points.split(' ').join(' L ')} L ${paddingLeft + (labels.length - 1) * step},${chartHeight + 20} L ${paddingLeft},${chartHeight + 20} Z`, fill: 'rgba(124,58,237,0.16)' }));

  labels.forEach((label, index) => {
    const x = paddingLeft + index * step;
    const y = chartHeight + 20;
    const circle = createSvgElement('circle', { cx: x, cy: chartHeight + 20 - (values[index] / maxValue) * chartHeight, r: 4, fill: '#ffffff', stroke: '#7c3aed', 'stroke-width': 2 });
    svg.appendChild(circle);

    const text = createSvgElement('text', { x, y: y + 20, 'text-anchor': 'middle', fill: 'rgba(255,255,255,0.8)', 'font-size': '9' });
    text.textContent = label.slice(5);
    svg.appendChild(text);
  });

  container.appendChild(svg);
}

function renderScatterChart(container, filtered) {
  container.innerHTML = '';
  const svg = createSvgElement('svg', { viewBox: '0 0 320 220' });
  const maxMag = Math.max(...filtered.map(item => item.mag), 1);
  const maxDepth = Math.max(...filtered.map(item => item.depth), 1);
  const colors = ['#7c3aed', '#16a34a', '#f59e0b', '#0ea5e9', '#ef4444'];
  const paddingLeft = 30;
  const paddingBottom = 30;
  const chartWidth = 260;
  const chartHeight = 160;

  svg.appendChild(createSvgElement('line', { x1: paddingLeft, y1: 20, x2: paddingLeft, y2: chartHeight + 20, stroke: 'rgba(255,255,255,0.3)', 'stroke-width': 1 }));
  svg.appendChild(createSvgElement('line', { x1: paddingLeft, y1: chartHeight + 20, x2: paddingLeft + chartWidth, y2: chartHeight + 20, stroke: 'rgba(255,255,255,0.3)', 'stroke-width': 1 }));

  filtered.forEach((item, index) => {
    const x = paddingLeft + (item.mag / maxMag) * chartWidth;
    const y = chartHeight + 20 - (item.depth / maxDepth) * chartHeight;
    const circle = createSvgElement('circle', { cx: x, cy: y, r: Math.max(3, 2.5 + item.mag / 2), fill: colors[index % colors.length], opacity: 0.8 });
    svg.appendChild(circle);
  });

  container.appendChild(svg);
}

function renderCharts(trendCounts, filtered, magnitudeBands, magnitudeValues, depthBands, depthValues) {

  const trendLabels = trendCounts.map(item => item[0]);
  const trendValues = trendCounts.map(item => item[1]);

  if (trendLabels.length) {
    renderLineChart(trendChartEl, trendLabels, trendValues);
  } else {
    trendChartEl.innerHTML = '<div style="color:rgba(255,255,255,0.7);padding-top:3rem;">Nenhum evento para exibir.</div>';
  }

  if (magnitudeBands && magnitudeValues) {
    renderBarChart(magnitudeChartEl, magnitudeBands, magnitudeValues);
  } else {
    magnitudeChartEl.innerHTML = '<div style="color:rgba(255,255,255,0.7);padding-top:3rem;">Nenhum evento para exibir.</div>';
  }

  if (filtered && filtered.length) {
    renderScatterChart(scatterChartEl, filtered);
  } else {
    scatterChartEl.innerHTML = '<div style="color:rgba(255,255,255,0.7);padding-top:3rem;">Nenhum evento para exibir.</div>';
  }

  if (depthBands && depthValues) {
    renderBarChart(depthChartEl, depthBands, depthValues);
  } else {
    depthChartEl.innerHTML = '<div style="color:rgba(255,255,255,0.7);padding-top:3rem;">Nenhum evento para exibir.</div>';
  }

}

function exportFilteredData(filtered) {
  const headers = ['id', 'place', 'enriched_location', 'region', 'country', 'date', 'mag', 'depth', 'score', 'severity'];
  const rows = filtered.map(item => {
    const severity = getSeverityLabel(item.mag);
    const score = getSeismicScore(item);
    const enrichedLocation = [item.city, item.nearestCity].filter(Boolean).join(' • ') || item.place;
    return [item.id, item.place, enrichedLocation, item.region, item.country, item.date, item.mag.toFixed(1), item.depth.toFixed(1), score, severity];
  });

  const csvContent = [headers.join(','), ...rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `terremotos-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function renderDetails(filtered) {
  const limitValue = detailsLimit ? detailsLimit.value : 'all';
  const sliced = limitValue === 'all' ? filtered : filtered.slice(0, Number(limitValue));

  detailsTable.innerHTML = sliced.length ? sliced.map(item => {
    const severity = getSeverityLabel(item.mag);
    const score = getSeismicScore(item);
    const enrichedLocation = [item.city, item.nearestCity].filter(Boolean).join(' • ') || item.place;
    const locationMeta = enrichedLocation && enrichedLocation !== item.place
      ? `<br><small style="color:rgba(255,255,255,0.6);">${enrichedLocation}</small>`
      : '';
    return `
      <tr>
        <td>${item.id}</td>
        <td>${item.place}${locationMeta}</td>
        <td>${item.region}</td>
        <td>${item.country}</td>
        <td>${item.date}</td>
        <td>${item.mag.toFixed(1)}</td>
        <td>${item.depth.toFixed(1)}</td>
        <td>${score}</td>
        <td><span class="severity-pill ${getSeverityClass(severity)}">${severity}</span></td>
      </tr>
    `;
  }).join('') : '<tr><td colspan="9">Nenhum evento encontrado para os filtros aplicados.</td></tr>';
}

function normalizeFeature(feature) {
  const props = feature.properties || {};
  const coords = feature.geometry?.coordinates || [];
  const inferredGeo = inferCountryRegionFromPlace(props.place);
  const country = normalizeCountryValue(props.country, inferredGeo.country, props.place);
  const region = normalizeRegionValue(props.region, country, inferredGeo.region);
  return {
    id: feature.id,
    place: props.place,
    region,
    country,
    city: props.city || null,
    nearestCity: props.nearest_city || null,
    date: new Date(props.time).toISOString().slice(0, 10),
    mag: Number(props.mag || 0),
    depth: Number(coords[2] || 0),
    tsunami: Boolean(props.tsunami),
    alert: Boolean(props.alert),
    significance: Number(props.sig || props.significance || 0)
  };
}

function buildModeParams(mode) {
  const baseParams = {
    format: 'geojson',
    eventtype: 'earthquake',
    orderby: 'time',
    minmagnitude: '2.5',
  };

  if (mode === 'latest_24h') {
    return {
      ...baseParams,
      limit: String(DASHBOARD_24H_LIMIT),
      starttime: getIsoUtcFromNow(1),
      endtime: new Date().toISOString(),
    };
  }

  if (mode === 'latest_7d') {
    return {
      ...baseParams,
      limit: String(DASHBOARD_7D_LIMIT),
      starttime: getIsoUtcFromNow(7),
      endtime: new Date().toISOString(),
    };
  }

  if (mode === 'historical_2026') {
    return {
      ...baseParams,
      limit: String(DASHBOARD_HISTORY_LIMIT),
      starttime: DASHBOARD_START_TIME,
      endtime: DASHBOARD_END_TIME,
    };
  }

  return {
    ...baseParams,
    limit: String(DASHBOARD_LATEST_LIMIT),
  };
}

function buildLocalModeData(mode) {
  const staticRows = getStaticDashboardData();
  const normalizedRows = staticRows.map(item => {
    const place = item.place || item.place_raw || '';
    const inferredGeo = inferCountryRegionFromPlace(place);
    const country = normalizeCountryValue(item.country, inferredGeo.country, place);
    const region = normalizeRegionValue(item.region, country, inferredGeo.region);
    return {
      ...item,
      region,
      country,
    date: String(item.date || ''),
    mag: Number(item.mag || 0),
    depth: Number(item.depth || 0),
    tsunami: Boolean(item.tsunami),
    alert: Boolean(item.alert),
    significance: Number(item.significance || item.sig || 0),
    };
  });
  return filterRowsByMode(normalizedRows, mode);
}

function loadDashboardDataFromApi(mode = 'latest_24h') {
  const params = new URLSearchParams(buildModeParams(mode));
  return fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?${params.toString()}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Falha ao buscar dados');
      }
      return response.json();
    })
    .then(payload => {
      const normalized = (payload.features || []).map(normalizeFeature);
      if (!normalized.length) {
        window.dashboardData = buildLocalModeData(mode);
        window.dashboardSource = 'fallback';
      } else {
        window.dashboardData = normalized;
        window.dashboardSource = 'api';
      }
      window.dashboardMode = mode;
      return window.dashboardData;
    })
    .catch(() => {
      window.dashboardData = buildLocalModeData(mode);
      window.dashboardSource = 'fallback';
      window.dashboardMode = mode;
      return window.dashboardData;
    });
}

function refreshDashboardData() {
  if (!refreshButton) return;

  const selectedMode = datasetModeFilter ? datasetModeFilter.value : 'latest_24h';
  refreshButton.disabled = true;
  refreshButton.textContent = 'Atualizando...';

  loadDashboardDataFromApi(selectedMode)
    .then(() => {
      populateDataFilters();
      updateDashboard();
    })
    .catch(() => {
      summaryText.innerHTML = '<strong>Não foi possível atualizar os dados.</strong> Tente novamente mais tarde.';
    })
    .finally(() => {
      if (refreshButton) {
        refreshButton.disabled = false;
        refreshButton.textContent = 'Atualizar dados';
      }
    });
}

function changeDatasetMode() {
  if (!datasetModeFilter) return;

  const selectedMode = datasetModeFilter.value;
  datasetModeFilter.disabled = true;
  if (refreshButton) {
    refreshButton.disabled = true;
  }
  summaryText.innerHTML = '<strong>Atualizando base de dados selecionada...</strong>';

  loadDashboardDataFromApi(selectedMode)
    .then(() => {
      resetDimensionFilters();
      populateDataFilters();
      updateDashboard();
    })
    .catch(() => {
      summaryText.innerHTML = '<strong>Não foi possível trocar o modo de dados.</strong> Tente novamente mais tarde.';
    })
    .finally(() => {
      datasetModeFilter.disabled = false;
      if (refreshButton) {
        refreshButton.disabled = false;
      }
    });
}

function initFilters() {
  populateDataFilters();

  [regionFilter, countryFilter, yearFilter, monthFilter, dayFilter].forEach(select => {
    select.addEventListener('change', () => {
      if (select === regionFilter || select === yearFilter || select === monthFilter || select === dayFilter) {
        refreshCountryFilterOptions();
      }
      updateDashboard();
    });
  });

  if (detailsLimit) {
    detailsLimit.addEventListener('change', () => {
      updateDashboard();
    });
  }

  if (refreshButton) {
    refreshButton.addEventListener('click', refreshDashboardData);
  }

  if (datasetModeFilter) {
    datasetModeFilter.addEventListener('change', changeDatasetMode);
  }

  if (exportButton) {
    exportButton.addEventListener('click', () => {
      exportFilteredData(getFilteredData());
    });
  }

  resetButton.addEventListener('click', () => {
    resetDimensionFilters();
    updateDashboard();
  });
}

function initDashboard() {
  const initialMode = datasetModeFilter ? datasetModeFilter.value : 'latest_24h';
  loadDashboardDataFromApi(initialMode).then(() => {
    initFilters();
    updateDashboard();
  });
}

initDashboard();
