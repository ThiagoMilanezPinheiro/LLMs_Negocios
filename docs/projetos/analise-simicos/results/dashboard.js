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
const scatterSummaryEl = document.getElementById('scatterSummary');
const depthChartEl = document.getElementById('depthChart');
const mapEl = document.getElementById('seismicMap');
const mapStatusEl = document.getElementById('mapStatus');
const mapAssetLayerFilter = document.getElementById('mapAssetLayerFilter');
const chartHoverTooltipEl = document.getElementById('chartHoverTooltip');
const toggleAnswersPanelBtn = document.getElementById('toggleAnswersPanel');
const toggleWellComparisonPanelBtn = document.getElementById('toggleWellComparisonPanel');
const answersPanelContent = document.getElementById('answersPanelContent');
const wellComparisonPanelContent = document.getElementById('wellComparisonPanelContent');

const kpiEvents = document.getElementById('kpiEvents');
const kpiM4 = document.getElementById('kpiM4');
const kpiM5 = document.getElementById('kpiM5');
const kpiMaxMag = document.getElementById('kpiMaxMag');
const kpiMedianDepth = document.getElementById('kpiMedianDepth');
const kpiLastDate = document.getElementById('kpiLastDate');
const summaryText = document.getElementById('summaryText');
const detailsTable = document.getElementById('detailsTable');
const detailsLimit = document.getElementById('detailsLimit');
const severityFilter = document.getElementById('severityFilter');
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
const insightTrendEl = document.getElementById('insightTrend');
const insightTrendMetaEl = document.getElementById('insightTrendMeta');
const insightHotspotsEl = document.getElementById('insightHotspots');
const insightHotspotsMetaEl = document.getElementById('insightHotspotsMeta');
const insightAlertsEl = document.getElementById('insightAlerts');
const insightAlertsMetaEl = document.getElementById('insightAlertsMeta');
const insightDistanceEl = document.getElementById('insightDistance');
const insightDistanceMetaEl = document.getElementById('insightDistanceMeta');
const attentionListEl = document.getElementById('attentionList');
const topSummaryEl = document.getElementById('topSummary');
const answerListEl = document.getElementById('answerList');
const executiveSignalMainEl = document.getElementById('executiveSignalMain');
const executiveSignalMetaEl = document.getElementById('executiveSignalMeta');
const wellDatasetStatusEl = document.getElementById('wellDatasetStatus');
const kpiWellsComparedEl = document.getElementById('kpiWellsCompared');
const kpiWells50kmEl = document.getElementById('kpiWells50km');
const kpiWells100kmEl = document.getElementById('kpiWells100km');
const kpiMinWellDistanceEl = document.getElementById('kpiMinWellDistance');
const wellComparisonTableEl = document.getElementById('wellComparisonTable');

const DASHBOARD_START_TIME = '2026-01-01';
const DASHBOARD_END_TIME = '2026-12-31';
const DASHBOARD_HISTORY_LIMIT = 20000;
const DASHBOARD_LATEST_LIMIT = 100;
const DASHBOARD_24H_LIMIT = 5000;
const DASHBOARD_7D_LIMIT = 20000;
const ANP_WELLS_URL = 'https://gishub.anp.gov.br/geoserver/BD_ANP/ows';
const ANP_WELLS_MAX_FEATURES = 40000;
const MAP_MAX_WELL_MARKERS = 5000;
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
const COUNTRY_CODE_BY_NAME = {
  'Estados Unidos': 'US',
  'México': 'MX',
  'Canadá': 'CA',
  'Colômbia': 'CO',
  'Brasil': 'BR',
  'Peru': 'PE',
  'Chile': 'CL',
  'Argentina': 'AR',
  'Equador': 'EC',
  'Bolívia': 'BO',
  'Paraguai': 'PY',
  'Uruguai': 'UY',
  'Venezuela': 'VE',
  'Indonesia': 'ID',
  'Irã': 'IR',
  'Japão': 'JP',
  'Rússia': 'RU',
  'China': 'CN',
  'Filipinas': 'PH',
  'Turquia': 'TR',
  'Índia': 'IN',
  'Fiji': 'FJ',
  'Vanuatu': 'VU',
  'Águas internacionais': 'INT',
};

let seismicMap = null;
let seismicLayer = null;
let wellLayer = null;
let fieldLayer = null;
let linkLayer = null;
let anpWells = [];
let anpWellsPromise = null;
let wellComparisonRunId = 0;
let mapAssetRunId = 0;

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

function parsePlaceDetails(place) {
  const text = String(place || '').trim();
  if (!text) {
    return { inferredCity: null, inferredDistanceKm: null };
  }

  const distanceMatch = text.match(/^(\d+(?:\.\d+)?)\s*km\b/i);
  const inferredDistanceKm = distanceMatch ? Number(distanceMatch[1]) : null;

  const cityMatch = text.match(/\bof\s+([^,]+)(?:,|$)/i);
  const inferredCity = cityMatch ? cityMatch[1].trim() : null;

  return { inferredCity, inferredDistanceKm };
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
    option.textContent = `${formatRegionPt(item.name)} (${item.code})`;
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

function getPercentile(values, percentile) {
  if (!values.length) return 0;
  const sorted = values.slice().sort((a, b) => a - b);
  const position = (sorted.length - 1) * (percentile / 100);
  const lowerIndex = Math.floor(position);
  const upperIndex = Math.ceil(position);
  if (lowerIndex === upperIndex) {
    return sorted[lowerIndex];
  }
  const lowerValue = sorted[lowerIndex];
  const upperValue = sorted[upperIndex];
  return lowerValue + (upperValue - lowerValue) * (position - lowerIndex);
}

function clampValue(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function niceNumber(range, round) {
  const exponent = Math.floor(Math.log10(range));
  const fraction = range / (10 ** exponent);
  let niceFraction;

  if (round) {
    if (fraction < 1.5) niceFraction = 1;
    else if (fraction < 3) niceFraction = 2;
    else if (fraction < 7) niceFraction = 5;
    else niceFraction = 10;
  } else if (fraction <= 1) niceFraction = 1;
  else if (fraction <= 2) niceFraction = 2;
  else if (fraction <= 5) niceFraction = 5;
  else niceFraction = 10;

  return niceFraction * (10 ** exponent);
}

function formatAxisNumber(value, digits = 1) {
  const rounded = Number(value.toFixed(digits));
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(digits).replace(/0+$/, '').replace(/\.$/, '');
}

function buildNiceScale(minValue, maxValue, targetTickCount = 6) {
  if (!Number.isFinite(minValue) || !Number.isFinite(maxValue)) {
    return {
      min: 0,
      max: 1,
      step: 1,
      ticks: [0, 1],
    };
  }

  let min = minValue;
  let max = maxValue;
  if (min === max) {
    const offset = min === 0 ? 1 : Math.max(0.5, Math.abs(min) * 0.1);
    min -= offset;
    max += offset;
  }

  const range = niceNumber(max - min, false);
  const step = niceNumber(range / Math.max(2, targetTickCount - 1), true);
  const niceMin = Math.floor(min / step) * step;
  const niceMax = Math.ceil(max / step) * step;
  const ticks = [];

  for (let value = niceMin; value <= niceMax + step * 0.5; value += step) {
    ticks.push(Number(value.toFixed(10)));
  }

  return {
    min: niceMin,
    max: niceMax,
    step,
    ticks,
  };
}

function drawXAxisScale(svg, options) {
  const {
    paddingLeft,
    topY,
    chartHeight,
    chartWidth,
    minValue,
    maxValue,
    tickCount = 6,
    formatter = (value) => formatAxisNumber(value, 1),
  } = options;

  const scale = buildNiceScale(minValue, maxValue, tickCount);
  const span = Math.max(scale.max - scale.min, 1);

  scale.ticks.forEach(value => {
    const ratio = (value - scale.min) / span;
    const x = paddingLeft + ratio * chartWidth;

    svg.appendChild(createSvgElement('line', {
      x1: x,
      y1: topY + chartHeight,
      x2: x,
      y2: topY + chartHeight + 6,
      stroke: 'rgba(255,255,255,0.32)',
      'stroke-width': 1,
    }));

    svg.appendChild(createSvgElement('line', {
      x1: x,
      y1: topY,
      x2: x,
      y2: topY + chartHeight,
      stroke: 'rgba(255,255,255,0.07)',
      'stroke-width': 1,
    }));

    const tickLabel = createSvgElement('text', {
      x,
      y: topY + chartHeight + 18,
      'text-anchor': 'middle',
      fill: 'rgba(255,255,255,0.76)',
      'font-size': '9',
    });
    tickLabel.textContent = formatter(value);
    svg.appendChild(tickLabel);
  });

  return scale;
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

function togglePanelContent(button, content) {
  if (!button || !content) return;
  const isCollapsed = content.classList.toggle('panel-collapsed-content');
  button.textContent = isCollapsed ? 'Abrir' : 'Fechar';
  button.setAttribute('aria-expanded', String(!isCollapsed));
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

function getSeverityColor(label) {
  if (label === 'CRITICA') return '#a855f7';
  if (label === 'ALTA') return '#ef4444';
  if (label === 'SIGNIFICATIVA') return '#f97316';
  if (label === 'MODERADA') return '#3b82f6';
  return '#22c55e';
}

function getSeismicScore(item) {
  const magnitudeBonus = item.mag * 8;
  const depthBonus = item.depth < 50 ? 12 : item.depth < 100 ? 6 : 0;
  const tsunamiBonus = item.tsunami ? 18 : 0;
  const alertBonus = item.alert ? 10 : 0;
  const significanceBonus = Math.min(20, (item.significance || 0) / 10);
  return Math.min(100, Math.round(magnitudeBonus + depthBonus + tsunamiBonus + alertBonus + significanceBonus));
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2))
    * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function normalizeWellFeature(feature) {
  const props = feature.properties || {};
  const coords = feature.geometry?.coordinates || [];
  const longitude = Number(coords[0]);
  const latitude = Number(coords[1]);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return {
    wellName: props.POCO || null,
    operator: props.OPERADOR || null,
    state: props.ESTADO || null,
    basin: props.BACIA || null,
    field: props.CAMPO || null,
    type: props.TIPO || null,
    status: props.SITUACAO || null,
    latitude,
    longitude,
  };
}

function deriveFieldCentroids(wells) {
  const groups = new Map();
  wells.forEach(well => {
    if (!well || !well.field || !Number.isFinite(well.latitude) || !Number.isFinite(well.longitude)) {
      return;
    }
    const key = `${well.field}::${well.basin || ''}`;
    if (!groups.has(key)) {
      groups.set(key, {
        fieldName: well.field,
        basin: well.basin || null,
        count: 0,
        sumLat: 0,
        sumLon: 0,
      });
    }
    const group = groups.get(key);
    group.count += 1;
    group.sumLat += well.latitude;
    group.sumLon += well.longitude;
  });

  return Array.from(groups.values()).map(group => ({
    fieldName: group.fieldName,
    basin: group.basin,
    wellCount: group.count,
    latitude: group.sumLat / group.count,
    longitude: group.sumLon / group.count,
  }));
}

function getCellKey(lat, lon, cellSizeDeg) {
  const latCell = Math.floor((lat + 90) / cellSizeDeg);
  const lonCell = Math.floor((lon + 180) / cellSizeDeg);
  return `${latCell}:${lonCell}`;
}

function buildEarthquakeSpatialIndex(rows, cellSizeDeg = 3) {
  const bins = new Map();
  rows.forEach(item => {
    if (!Number.isFinite(item.latitude) || !Number.isFinite(item.longitude)) return;
    const key = getCellKey(item.latitude, item.longitude, cellSizeDeg);
    if (!bins.has(key)) {
      bins.set(key, []);
    }
    bins.get(key).push(item);
  });
  return { bins, cellSizeDeg };
}

function getNearbyEarthquakes(index, lat, lon, maxRing = 4) {
  const { bins, cellSizeDeg } = index;
  const latCell = Math.floor((lat + 90) / cellSizeDeg);
  const lonCell = Math.floor((lon + 180) / cellSizeDeg);

  for (let ring = 0; ring <= maxRing; ring += 1) {
    const candidates = [];
    for (let dLat = -ring; dLat <= ring; dLat += 1) {
      for (let dLon = -ring; dLon <= ring; dLon += 1) {
        const key = `${latCell + dLat}:${lonCell + dLon}`;
        const bucket = bins.get(key);
        if (bucket && bucket.length) {
          candidates.push(...bucket);
        }
      }
    }
    if (candidates.length) {
      return candidates;
    }
  }
  return [];
}

function renderWellComparisonLoading(message) {
  if (wellComparisonTableEl) {
    wellComparisonTableEl.innerHTML = `<tr><td colspan="7">${message}</td></tr>`;
  }
}

function renderWellComparisonRows(rows) {
  if (!wellComparisonTableEl) return;
  if (!rows.length) {
    wellComparisonTableEl.innerHTML = '<tr><td colspan="7">Sem interseção geográfica entre poços e eventos para os filtros atuais.</td></tr>';
    return;
  }

  wellComparisonTableEl.innerHTML = rows.map(item => `
    <tr>
      <td>${item.wellName || '—'}</td>
      <td>${item.operator || '—'}</td>
      <td>${item.basin || '—'}</td>
      <td>${item.state || '—'}</td>
      <td>${item.nearestPlace || '—'}</td>
      <td>${Number.isFinite(item.nearestMagnitude) ? item.nearestMagnitude.toFixed(1) : '—'}</td>
      <td>${Number.isFinite(item.minDistanceKm) ? item.minDistanceKm.toFixed(1) : '—'}</td>
    </tr>
  `).join('');
}

function updateWellKpis(metrics) {
  if (kpiWellsComparedEl) kpiWellsComparedEl.textContent = String(metrics.wellsCompared || 0);
  if (kpiWells50kmEl) kpiWells50kmEl.textContent = String(metrics.wells50km || 0);
  if (kpiWells100kmEl) kpiWells100kmEl.textContent = String(metrics.wells100km || 0);
  if (kpiMinWellDistanceEl) {
    kpiMinWellDistanceEl.textContent = Number.isFinite(metrics.minDistanceKm) ? `${metrics.minDistanceKm.toFixed(1)} km` : '—';
  }
}

function filterWellsByEarthquakeBounds(wells, earthquakes, paddingDeg = 2) {
  const rows = earthquakes.filter(item => Number.isFinite(item.latitude) && Number.isFinite(item.longitude));
  if (!rows.length) return [];

  const lats = rows.map(item => item.latitude);
  const lons = rows.map(item => item.longitude);
  const minLat = Math.max(-90, Math.min(...lats) - paddingDeg);
  const maxLat = Math.min(90, Math.max(...lats) + paddingDeg);
  const minLon = Math.max(-180, Math.min(...lons) - paddingDeg);
  const maxLon = Math.min(180, Math.max(...lons) + paddingDeg);

  return wells.filter(well => well.latitude >= minLat
    && well.latitude <= maxLat
    && well.longitude >= minLon
    && well.longitude <= maxLon);
}

function computeWellComparison(wells, earthquakes) {
  if (!wells.length || !earthquakes.length) {
    return {
      rows: [],
      metrics: { wellsCompared: 0, wells50km: 0, wells100km: 0, minDistanceKm: null },
    };
  }

  const index = buildEarthquakeSpatialIndex(earthquakes);
  const comparisons = [];

  wells.forEach(well => {
    const candidates = getNearbyEarthquakes(index, well.latitude, well.longitude);
    if (!candidates.length) return;

    let bestEvent = null;
    let bestDistance = Number.POSITIVE_INFINITY;
    candidates.forEach(event => {
      const distanceKm = haversineKm(well.latitude, well.longitude, event.latitude, event.longitude);
      if (distanceKm < bestDistance) {
        bestDistance = distanceKm;
        bestEvent = event;
      }
    });

    if (!bestEvent || !Number.isFinite(bestDistance)) return;
    comparisons.push({
      ...well,
      minDistanceKm: bestDistance,
      nearestEventId: bestEvent.id,
      nearestPlace: bestEvent.place,
      nearestMagnitude: bestEvent.mag,
      nearestDate: bestEvent.date,
    });
  });

  comparisons.sort((a, b) => a.minDistanceKm - b.minDistanceKm);
  const wells50km = comparisons.filter(item => item.minDistanceKm <= 50).length;
  const wells100km = comparisons.filter(item => item.minDistanceKm <= 100).length;
  const minDistanceKm = comparisons.length ? comparisons[0].minDistanceKm : null;

  return {
    rows: comparisons,
    metrics: {
      wellsCompared: comparisons.length,
      wells50km,
      wells100km,
      minDistanceKm,
    },
  };
}

function ensureAnpWellsLoaded() {
  if (anpWells.length) {
    return Promise.resolve(anpWells);
  }
  if (anpWellsPromise) {
    return anpWellsPromise;
  }

  if (wellDatasetStatusEl) {
    wellDatasetStatusEl.textContent = 'Base de poços: carregando ANP...';
  }

  const params = new URLSearchParams({
    service: 'WFS',
    version: '1.0.0',
    request: 'GetFeature',
    typeName: 'BD_ANP:POCOS_SIRGAS',
    maxFeatures: String(ANP_WELLS_MAX_FEATURES),
    outputFormat: 'application/json',
  });

  anpWellsPromise = fetch(`${ANP_WELLS_URL}?${params.toString()}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Falha ao carregar poços ANP');
      }
      return response.json();
    })
    .then(payload => {
      anpWells = (payload.features || []).map(normalizeWellFeature).filter(Boolean);
      if (wellDatasetStatusEl) {
        wellDatasetStatusEl.textContent = `Base de poços: ANP oficial carregada (${anpWells.length} poços)`;
      }
      return anpWells;
    })
    .catch(() => {
      anpWells = [];
      if (wellDatasetStatusEl) {
        wellDatasetStatusEl.textContent = 'Base de poços: falha no carregamento ANP';
      }
      return anpWells;
    })
    .finally(() => {
      anpWellsPromise = null;
    });

  return anpWellsPromise;
}

function updateWellComparison(filtered) {
  const rowsWithCoords = filtered.filter(item => Number.isFinite(item.latitude) && Number.isFinite(item.longitude));
  if (!rowsWithCoords.length) {
    updateWellKpis({ wellsCompared: 0, wells50km: 0, wells100km: 0, minDistanceKm: null });
    renderWellComparisonRows([]);
    return;
  }

  const runId = ++wellComparisonRunId;
  renderWellComparisonLoading('Calculando proximidade poço x abalo...');
  ensureAnpWellsLoaded().then(allWells => {
    if (runId !== wellComparisonRunId) return;

    const scopedWells = filterWellsByEarthquakeBounds(allWells, rowsWithCoords);
    const { rows, metrics } = computeWellComparison(scopedWells, rowsWithCoords);
    updateWellKpis(metrics);
    renderWellComparisonRows(rows.slice(0, 10));
  });
}

function showChartTooltip(content, event) {
  if (!chartHoverTooltipEl || !content) return;
  chartHoverTooltipEl.innerHTML = content;
  chartHoverTooltipEl.style.display = 'block';
  const offsetX = 14;
  const offsetY = 14;
  const viewportPadding = 12;
  const tooltipRect = chartHoverTooltipEl.getBoundingClientRect();
  let left = event.clientX + offsetX;
  let top = event.clientY + offsetY;

  if (left + tooltipRect.width > window.innerWidth - viewportPadding) {
    left = event.clientX - tooltipRect.width - offsetX;
  }
  if (top + tooltipRect.height > window.innerHeight - viewportPadding) {
    top = event.clientY - tooltipRect.height - offsetY;
  }

  chartHoverTooltipEl.style.left = `${Math.max(viewportPadding, left)}px`;
  chartHoverTooltipEl.style.top = `${Math.max(viewportPadding, top)}px`;
}

function hideChartTooltip() {
  if (!chartHoverTooltipEl) return;
  chartHoverTooltipEl.style.display = 'none';
}

function attachChartHover(target, tooltipBuilder) {
  if (!target || typeof tooltipBuilder !== 'function') return;
  target.addEventListener('mousemove', event => {
    const html = tooltipBuilder();
    showChartTooltip(html, event);
  });
  target.addEventListener('mouseleave', hideChartTooltip);
}

function formatUtcDate(ms) {
  if (!Number.isFinite(ms)) return null;
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(ms));
}

function formatUtcTime(ms) {
  if (!Number.isFinite(ms)) return null;
  return new Date(ms).toISOString().slice(11, 19);
}

function formatLocalTime(ms) {
  if (!Number.isFinite(ms)) return null;
  return new Date(ms).toLocaleTimeString('pt-BR', { hour12: false });
}

function formatAlert(value) {
  if (!value) return null;
  const txt = String(value).trim();
  if (!txt) return null;
  return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
}

function getCountryCode(item) {
  const raw = String(item.countryCode || '').trim().toUpperCase();
  if (raw) return raw;
  return COUNTRY_CODE_BY_NAME[item.country] || null;
}

function mapDetailRow(label, value) {
  if (value === null || value === undefined || value === '') return '';
  return `<div class="map-popup-item"><strong>${label}</strong><br>${value}</div>`;
}

function buildMapPopupHtml(item) {
  const date = formatUtcDate(item.timestampMs);
  const utcTime = formatUtcTime(item.timestampMs);
  const localTime = formatLocalTime(item.timestampMs);
  const magnitude = Number.isFinite(item.mag) ? `${item.mag.toFixed(1)}${item.magType ? ` ${item.magType}` : ''}` : null;
  const depth = Number.isFinite(item.depth) ? `${item.depth.toFixed(1)} km` : null;
  const latitude = Number.isFinite(item.latitude) ? item.latitude.toFixed(4) : null;
  const longitude = Number.isFinite(item.longitude) ? item.longitude.toFixed(4) : null;
  const tsunami = typeof item.tsunami === 'boolean' ? (item.tsunami ? 'Sim' : 'Não') : null;
  const alert = formatAlert(item.alert);
  const significance = Number.isFinite(item.significance) ? String(Math.round(item.significance)) : null;
  const distance = Number.isFinite(item.distanceToCityKm) ? `${item.distanceToCityKm.toFixed(1)} km` : null;

  const rows = [
    mapDetailRow('ID do Evento', item.id),
    mapDetailRow('Magnitude', magnitude),
    mapDetailRow('Profundidade', depth),
    mapDetailRow('Data', date),
    mapDetailRow('Hora UTC', utcTime),
    mapDetailRow('Hora Local', localTime),
    mapDetailRow('Localização', item.place),
    mapDetailRow('País', item.country),
    mapDetailRow('Latitude', latitude),
    mapDetailRow('Longitude', longitude),
    mapDetailRow('Tsunami', tsunami),
    mapDetailRow('Alerta', alert),
    mapDetailRow('Significância', significance),
    mapDetailRow('Cidade mais próxima', item.nearestCity),
    mapDetailRow('Distância', distance),
  ].filter(Boolean);

  return `<div class="map-popup-scroll">${rows.join('<hr style="border:none;border-top:1px solid rgba(0,0,0,0.12);margin:6px 0;">')}</div>`;
}

function buildMapTooltipText(item) {
  const code = getCountryCode(item);
  const city = item.nearestCity || item.city;
  const segments = [];
  if (code) segments.push(code);
  if (city) segments.push(city);
  return segments.join(' • ');
}

function initSeismicMap() {
  if (!mapEl || typeof L === 'undefined' || seismicMap) {
    return;
  }

  seismicMap = L.map(mapEl, {
    center: [12, 0],
    zoom: 2,
    minZoom: 2,
    worldCopyJump: true,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(seismicMap);

  seismicLayer = L.layerGroup().addTo(seismicMap);
  wellLayer = L.layerGroup().addTo(seismicMap);
  fieldLayer = L.layerGroup().addTo(seismicMap);
  linkLayer = L.layerGroup().addTo(seismicMap);
}

function getMapAssetMode() {
  return mapAssetLayerFilter ? mapAssetLayerFilter.value : 'none';
}

function drawNearestAssetConnection(event, wells, fields, mode) {
  if (!linkLayer || !event || !Number.isFinite(event.latitude) || !Number.isFinite(event.longitude)) return;

  const pool = [];
  if ((mode === 'wells' || mode === 'both') && Array.isArray(wells)) {
    wells.forEach(well => {
      pool.push({
        type: 'well',
        coords: [well.latitude, well.longitude],
        color: '#facc15',
        distance: haversineKm(event.latitude, event.longitude, well.latitude, well.longitude),
      });
    });
  }

  if ((mode === 'fields' || mode === 'both') && Array.isArray(fields)) {
    fields.forEach(field => {
      pool.push({
        type: 'field',
        coords: [field.latitude, field.longitude],
        color: '#38bdf8',
        distance: haversineKm(event.latitude, event.longitude, field.latitude, field.longitude),
      });
    });
  }

  if (!pool.length) return;

  const nearestAsset = pool.reduce((best, current) => {
    if (!best || current.distance < best.distance) return current;
    return best;
  }, null);

  if (!nearestAsset) return;

  const line = L.polyline([
    [event.latitude, event.longitude],
    nearestAsset.coords,
  ], {
    color: nearestAsset.color,
    weight: 1.8,
    opacity: 0.58,
    dashArray: '4 7',
    lineCap: 'round',
    lineJoin: 'round',
  });

  line.bindTooltip(`<strong>Evento sísmico</strong><br>${event.place || 'Local não informado'}<br><strong>Distância:</strong> ${nearestAsset.distance.toFixed(1)} km`, { direction: 'top', sticky: true, opacity: 0.9 });
  line.bindPopup(`<strong>Evento sísmico</strong><br>${event.place || 'Local não informado'}<br><strong>Distância:</strong> ${nearestAsset.distance.toFixed(1)} km`);
  line.addTo(linkLayer);
  line.bringToFront();
}

function getNearestAssetForEvent(event, wells, fields, mode) {
  const pool = [];

  if ((mode === 'wells' || mode === 'both') && Array.isArray(wells)) {
    wells.forEach(well => {
      pool.push({
        type: 'well',
        coords: [well.latitude, well.longitude],
        color: '#facc15',
        distance: haversineKm(event.latitude, event.longitude, well.latitude, well.longitude),
      });
    });
  }

  if ((mode === 'fields' || mode === 'both') && Array.isArray(fields)) {
    fields.forEach(field => {
      pool.push({
        type: 'field',
        coords: [field.latitude, field.longitude],
        color: '#38bdf8',
        distance: haversineKm(event.latitude, event.longitude, field.latitude, field.longitude),
      });
    });
  }

  if (!pool.length) return null;

  return pool.reduce((best, current) => {
    if (!best || current.distance < best.distance) return current;
    return best;
  }, null);
}

function getPriorityAssetLinkEvent(rowsWithCoords, wells, fields, mode) {
  const relevant = rowsWithCoords.filter(item => {
    const severity = getSeverityLabel(Number(item.mag));
    return severity === 'CRITICA' || severity === 'ALTA';
  });

  const candidates = relevant.length ? relevant : rowsWithCoords;
  if (!candidates.length) return null;

  let bestCandidate = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  candidates.forEach(current => {
    const nearestAsset = getNearestAssetForEvent(current, wells, fields, mode);
    if (!nearestAsset) return;

    if (!bestCandidate || nearestAsset.distance < bestDistance || (nearestAsset.distance === bestDistance && getSeismicScore(current) > getSeismicScore(bestCandidate))) {
      bestCandidate = current;
      bestDistance = nearestAsset.distance;
    }
  });

  return bestCandidate;
}

function updateMapAssets(rowsWithCoords, bounds) {
  if (!seismicMap) {
    return Promise.resolve({ wellsShown: 0, fieldsShown: 0, allBounds: bounds.slice() });
  }

  if (!wellLayer) wellLayer = L.layerGroup().addTo(seismicMap);
  if (!fieldLayer) fieldLayer = L.layerGroup().addTo(seismicMap);
  if (!linkLayer) linkLayer = L.layerGroup().addTo(seismicMap);

  wellLayer.clearLayers();
  fieldLayer.clearLayers();
  linkLayer.clearLayers();

  const mode = getMapAssetMode();
  if (mode === 'none') {
    return Promise.resolve({ wellsShown: 0, fieldsShown: 0, allBounds: bounds.slice() });
  }

  return ensureAnpWellsLoaded().then(allWells => {
    const scopedWells = filterWellsByEarthquakeBounds(allWells, rowsWithCoords);
    const cappedWells = scopedWells.slice(0, MAP_MAX_WELL_MARKERS);
    let wellsShown = 0;
    let fieldsShown = 0;
    const allBounds = bounds.slice();
    const fieldCentroids = mode === 'fields' || mode === 'both' ? deriveFieldCentroids(cappedWells) : [];

    if (mode === 'wells' || mode === 'both') {
      cappedWells.forEach(well => {
        const marker = L.circleMarker([well.latitude, well.longitude], {
          radius: 3,
          color: '#ffffff',
          weight: 1.2,
          fillColor: '#facc15',
          fillOpacity: 0.8,
          opacity: 0.95,
        });
        const tooltipText = `<strong>Poço:</strong> ${well.wellName || '—'}<br><strong>Operador:</strong> ${well.operator || '—'}<br><strong>Bacia:</strong> ${well.basin || '—'}<br><strong>Estado:</strong> ${well.state || '—'}`;
        marker.bindTooltip(tooltipText, { direction: 'top', sticky: true, opacity: 0.96 });
        marker.bindPopup(tooltipText);
        marker.on('mouseover', () => marker.openTooltip());
        marker.on('mouseout', () => marker.closeTooltip());
        marker.addTo(wellLayer);
        wellsShown += 1;
        allBounds.push([well.latitude, well.longitude]);
      });
    }

    if (mode === 'fields' || mode === 'both') {
      fieldCentroids.forEach(field => {
        const marker = L.circleMarker([field.latitude, field.longitude], {
          radius: Math.max(4, Math.min(9, 3 + Math.log10(field.wellCount + 1) * 2)),
          color: '#ffffff',
          weight: 1.2,
          fillColor: '#0ea5e9',
          fillOpacity: 0.7,
          opacity: 0.9,
        });
        const tooltipText = `<strong>Campo:</strong> ${field.fieldName}<br><strong>Bacia:</strong> ${field.basin || '—'}<br><strong>Poços no campo:</strong> ${field.wellCount}`;
        marker.bindTooltip(tooltipText, { direction: 'top', sticky: true, opacity: 0.96 });
        marker.bindPopup(tooltipText);
        marker.on('mouseover', () => marker.openTooltip());
        marker.on('mouseout', () => marker.closeTooltip());
        marker.addTo(fieldLayer);
        fieldsShown += 1;
        allBounds.push([field.latitude, field.longitude]);
      });
    }

    const primaryEvent = getPriorityAssetLinkEvent(rowsWithCoords, cappedWells, fieldCentroids, mode);
    if (primaryEvent) {
      drawNearestAssetConnection(primaryEvent, cappedWells, fieldCentroids, mode);
    }

    return { wellsShown, fieldsShown, allBounds, wellsTotal: scopedWells.length };
  });
}

function updateSeismicMap(filtered) {
  if (!mapEl) {
    return;
  }

  initSeismicMap();
  if (!seismicMap || !seismicLayer) {
    if (mapStatusEl) {
      mapStatusEl.textContent = 'Mapa indisponível neste ambiente.';
    }
    return;
  }

  seismicLayer.clearLayers();
  if (linkLayer) linkLayer.clearLayers();
  const rowsWithCoords = filtered.filter(item => Number.isFinite(item.latitude) && Number.isFinite(item.longitude));

  if (!rowsWithCoords.length) {
    if (mapStatusEl) {
      mapStatusEl.textContent = 'Sem coordenadas geográficas disponíveis para a seleção atual.';
    }
    seismicMap.setView([12, 0], 2);
    if (wellLayer) wellLayer.clearLayers();
    if (fieldLayer) fieldLayer.clearLayers();
    if (linkLayer) linkLayer.clearLayers();
    return;
  }

  const bounds = [];
  rowsWithCoords.forEach(item => {
    const magnitude = Number.isFinite(item.mag) ? item.mag : 0;
    const severity = getSeverityLabel(magnitude);
    const radius = Math.max(3, Math.min(14, magnitude * 1.6));
    const markerColor = getSeverityColor(severity);
    const marker = L.circleMarker([item.latitude, item.longitude], {
      radius,
      color: '#ffffff',
      weight: 1.4,
      fillColor: markerColor,
      fillOpacity: 0.72,
      opacity: 0.95,
    });

    const tooltipText = buildMapTooltipText(item);
    if (tooltipText) {
      marker.bindTooltip(tooltipText, { direction: 'top', sticky: true, opacity: 0.95 });
    }

    const popupHtml = buildMapPopupHtml(item);
    if (popupHtml) {
      marker.bindPopup(popupHtml, { maxWidth: 320 });
    }
    marker.addTo(seismicLayer);
    bounds.push([item.latitude, item.longitude]);
  });

  const runId = ++mapAssetRunId;
  updateMapAssets(rowsWithCoords, bounds).then(({ wellsShown, fieldsShown, allBounds, wellsTotal }) => {
    if (runId !== mapAssetRunId) return;

    if (allBounds.length === 1) {
      seismicMap.setView(allBounds[0], 5);
    } else {
      seismicMap.fitBounds(allBounds, { padding: [25, 25], maxZoom: 6 });
    }

    if (mapStatusEl) {
      const missingCoords = filtered.length - rowsWithCoords.length;
      const mode = getMapAssetMode();
      const assetText = mode === 'none'
        ? ''
        : ` • poços: ${wellsShown}${Number.isFinite(wellsTotal) && wellsTotal > wellsShown ? `/${wellsTotal}` : ''} • campos: ${fieldsShown}`;
      mapStatusEl.textContent = missingCoords > 0
        ? `${rowsWithCoords.length} pontos sísmicos exibidos (${missingCoords} sem coordenadas)${assetText}.`
        : `${rowsWithCoords.length} pontos sísmicos exibidos${assetText}.`;
    }
  });
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
    summaryText.innerHTML = '<strong>Sem dados para esta seleção.</strong>';
    renderCharts([], [], [], []);
    updateSeismicMap([]);
    renderDetails([]);
    updateWellKpis({ wellsCompared: 0, wells50km: 0, wells100km: 0, minDistanceKm: null });
    renderWellComparisonRows([]);
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
  const topRegionLabel = topRegionItem === '—' ? '—' : formatRegionPt(topRegionItem);
  const topCountryItem = countryCounts[0] ? countryCounts[0][0] : '—';
  const activeRegionFilter = regionFilter.value || null;
  const activeCountryFilter = countryFilter.value || null;
  const filterMatchedRows = filtered.filter(item => {
    const itemRegion = normalizeGeoValue(item.region, UNKNOWN_REGION);
    const itemCountry = normalizeGeoValue(item.country, UNKNOWN_COUNTRY);
    const matchesRegion = !activeRegionFilter || itemRegion === activeRegionFilter;
    const matchesCountry = !activeCountryFilter || itemCountry === activeCountryFilter;
    return matchesRegion && matchesCountry;
  });
  const topMagnitudeEvent = filterMatchedRows.length
    ? filterMatchedRows.reduce((max, item) => item.mag > max.mag ? item : max, filterMatchedRows[0])
    : filtered[0];
  const topMagnitudeItem = topMagnitudeEvent.mag.toFixed(1);
  const topMagnitudePlace = topMagnitudeEvent.place;
  const topEvent = topMagnitudeEvent;
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
  const mostIntenseRegionLabel = mostIntenseRegion.name === '—' ? '—' : formatRegionPt(mostIntenseRegion.name);

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
  const feltEvents = filtered.filter(item => Number(item.felt) > 0).length;
  const significantEvents = filtered.filter(item => (item.significance || 0) >= 100).length;
  const hotspotList = regionCounts.slice(0, 3).map(([name, value], index) => `
    <div class="mini-line"><span>${index + 1}. ${formatRegionPt(name)}</span><span>(${value})</span></div>
  `).join('');
  const trendDelta = count - (dashboardData.filter(item => item.date < lastDate && item.date >= new Date(new Date(lastDate).getTime() - 7 * 24 * 60 * 60 * 1000)).length || 0);
  const trendText = trendDelta > 0 ? `+${trendDelta}` : String(trendDelta);
  const hourlySpread = filtered.reduce((acc, item) => {
    const hour = new Date(item.date).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {});
  const dominantHour = Object.entries(hourlySpread).sort((a, b) => b[1] - a[1])[0];
  const hourlyLabel = dominantHour ? `${dominantHour[0]}h` : '—';

  const regionShare = count ? ((regionCounts[0] ? regionCounts[0][1] : 0) / count * 100).toFixed(0) : 0;
  const geographicLabel = topRegionItem === 'Outros' && topCountryItem === 'Outros'
    ? 'a classificação geográfica do catálogo permanece agregada'
    : `${topRegionLabel} como principal concentração regional e ${topCountryItem} como principal país da seleção`;
  const topEventDate = topEvent && topEvent.date ? new Date(topEvent.date) : null;
  const topEventDateLabel = topEventDate ? topEventDate.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }) : '—';
  const topEventDepthLabel = topEvent && Number.isFinite(topEvent.depth) ? `${topEvent.depth.toFixed(1)} km` : '—';
  const topEventLocationLabel = topEvent ? `${topEvent.place || topMagnitudePlace}` : topMagnitudePlace;
  const topEventRegionLabel = topEvent && topEvent.region ? formatRegionPt(topEvent.region) : topRegionLabel;
  const topEventCountryLabel = topEvent && topEvent.country ? topEvent.country : topCountryItem;

  summaryText.innerHTML = `<strong>Severidade Analítica:</strong> ${getSeverityLabel(maxMag)} • ${count} eventos • profundidade mediana ${medianDepth.toFixed(1)} km • ${geographicLabel}.`;
  if (executiveSignalMainEl) {
    executiveSignalMainEl.textContent = `${topRegionLabel} é o centro da seleção • ${count} eventos monitorados`;
  }
  if (executiveSignalMetaEl) {
    executiveSignalMetaEl.textContent = `Maior evento: ${topEventLocationLabel} (${topEventRegionLabel}, ${topEventCountryLabel}) • M ${topMagnitudeItem} • ${topEventDateLabel} • profundidade ${topEventDepthLabel} • tendência ${trendStatus} • ${m6Events} eventos M6+`;
  }

  insightHighestEl.textContent = `${maxMag.toFixed(1)} M`;
  insightHighestMetaEl.textContent = `${topMagnitudePlace} • ${lastDate} • ${m7Events} eventos M7+`;
  insightRegionEl.textContent = `${topRegionLabel}`;
  insightRegionMetaEl.textContent = `${regionCounts[0] ? regionCounts[0][1] : 0} eventos • ${((regionCounts[0] ? regionCounts[0][1] : 0) / count * 100).toFixed(0)}% do total`;
  insightMagnitudeBandEl.textContent = dominantBand;
  insightMagnitudeMetaEl.textContent = `${dominantBandCount} eventos • ${m6Events} M6+ • ${m7Events} M7+`;
  insightTemporalEl.textContent = temporalInsight;
  insightTemporalMetaEl.textContent = `magnitude mediana ${medianMag} • profundidade mediana ${medianDepthAll} km • pico horário ${hourlyLabel}`;
  if (insightTrendEl) insightTrendEl.textContent = trendText;
  if (insightTrendMetaEl) insightTrendMetaEl.textContent = `${Math.abs(trendDelta)} eventos ${trendDelta >= 0 ? 'acima' : 'abaixo'} da janela anterior`;
  if (insightHotspotsEl) insightHotspotsEl.innerHTML = hotspotList || '—';
  if (insightHotspotsMetaEl) insightHotspotsMetaEl.textContent = `${regionCounts[0] ? regionCounts[0][1] : 0} eventos na liderança`;
  if (insightAlertsEl) {
    insightAlertsEl.innerHTML = `
      <div class="mini-line"><span>Alertas = ${alertEvents}</span></div>
      <div class="mini-line"><span>Tsunami = ${tsunamiEvents}</span></div>
      <div class="mini-line"><span>Felt = ${feltEvents}</span></div>
    `;
  }
  if (insightAlertsMetaEl) insightAlertsMetaEl.textContent = '';
  if (insightDistanceEl) insightDistanceEl.textContent = '—';
  if (insightDistanceMetaEl) insightDistanceMetaEl.textContent = 'Sem comparação ANP na seleção atual';

  lastUpdatedEl.textContent = `Última atualização: ${new Date().toLocaleString('pt-BR')}`;
  if (window.dashboardSource === 'api') {
    const modeLabel = getDatasetModeLabel(window.dashboardMode);
    dataSourceEl.textContent = `Fonte: USGS Earthquake Catalog (ao vivo) • ${modeLabel}`;
  } else {
    dataSourceEl.textContent = 'Fonte: dados locais / contingência';
  }
  recordsLoadedEl.textContent = `Eventos carregados: ${dashboardData.length}`;
  const minDate = dayValues[0] || '—';
  dateRangeEl.textContent = `Período: ${minDate} → ${lastDate}`;

  answerListEl.innerHTML = `
    <div class="answer-item"><strong>Onde acontecem?</strong><br>A maior concentração da seleção está em ${topRegionLabel}; ${topCountryItem} aparece como o principal agrupamento geográfico dentro do contexto analisado.</div>
    <div class="answer-item"><strong>Quais são os mais relevantes?</strong><br>O evento de maior relevância analítica foi ${topEvent.place}, com magnitude ${topEvent.mag.toFixed(1)}, score ${getSeismicScore(topEvent)} e severidade ${getSeverityLabel(topEvent.mag)}.</div>
    <div class="answer-item"><strong>A atividade está aumentando ou diminuindo?</strong><br>A tendência observada é ${trendStatus} ao longo do intervalo analisado, com ${distinctDays.length} dias registrados e pico horário ${hourlyLabel}.</div>
    <div class="answer-item"><strong>Existe relação entre magnitude e profundidade?</strong><br>A correlação estimada é ${correlationLabel} (${correlation.toFixed(2)}), o que sugere ${correlation > 0.3 ? 'uma leve tendência de eventos mais fortes em maiores profundidades' : correlation < -0.3 ? 'uma leve tendência de eventos mais fortes em menores profundidades' : 'pouca relação linear entre magnitude e profundidade'}.</div>
    <div class="answer-item"><strong>Quais regiões apresentam maior intensidade?</strong><br>${mostIntenseRegionLabel} registrou a maior magnitude mediana da seleção: ${mostIntenseRegion.medianMagnitude.toFixed(1)} M em ${mostIntenseRegion.count} eventos.</div>
    <div class="answer-item"><strong>Há sinais de eventos críticos?</strong><br>Há ${m6Events} eventos M6+, ${m7Events} eventos M7+, ${tsunamiEvents} com tsunami e ${alertEvents} com alerta, além de ${significantEvents} eventos de alta significância.</div>
  `;

  const attentionItems = filtered.filter(item => item.mag >= 5 || item.tsunami || item.alert || item.mag >= 6 || (item.significance || 0) >= 50)
    .sort((a, b) => b.mag - a.mag)
    .slice(0, 6);
  const visibleAttentionItems = Array.from({ length: 6 }, (_, index) => attentionItems[index] || null);
  attentionListEl.innerHTML = visibleAttentionItems.map(item => {
    if (!item) {
      return '<div class="attention-item" style="opacity:0.38; border-style:dashed;"><strong>Sem evento</strong><br><small>Slot reservado para expansão</small><br><span class="severity-pill" style="background:rgba(148,163,184,0.18);color:rgba(255,255,255,0.7);">—</span></div>';
    }
    const severity = getSeverityLabel(item.mag);
    return `<div class="attention-item"><strong>${item.place}</strong><br><small>${item.date} • M ${item.mag.toFixed(1)} • ${item.country}</small><br><span class="severity-pill ${getSeverityClass(severity)}" style="display:flex; justify-content:center; align-items:center; width:100%; min-height:38px; text-align:center;">${severity}</span></div>`;
  }).join('');

  renderCharts(trendCounts, filtered, magnitudeBands, magnitudeValues, depthBands, depthValues);
  updateSeismicMap(filtered);
  renderDetails(filtered);
  updateWellComparison(filtered);
}

function createSvgElement(tag, attrs = {}) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

function drawYAxisScale(svg, options) {
  const {
    paddingLeft,
    topY,
    chartHeight,
    chartWidth,
    minValue = 0,
    maxValue,
    tickCount = 4,
    invert = false,
    formatter = (value) => String(Math.round(value)),
  } = options;

  const safeMin = Number.isFinite(minValue) ? minValue : 0;
  const safeMax = Number.isFinite(maxValue) ? maxValue : 1;
  const scale = buildNiceScale(safeMin, safeMax, tickCount);
  const domainMin = scale.min;
  const domainMax = scale.max;
  const span = Math.max(domainMax - domainMin, 1);
  const tickValues = scale.ticks;

  tickValues.forEach(value => {
    const ratio = (value - domainMin) / span;
    const y = invert ? topY + ratio * chartHeight : topY + chartHeight - ratio * chartHeight;

    const gridLine = createSvgElement('line', {
      x1: paddingLeft,
      y1: y,
      x2: paddingLeft + chartWidth,
      y2: y,
      stroke: 'rgba(255,255,255,0.12)',
      'stroke-width': 1,
    });
    svg.appendChild(gridLine);

    const tickLabel = createSvgElement('text', {
      x: paddingLeft - 6,
      y: y + 3,
      'text-anchor': 'end',
      fill: 'rgba(255,255,255,0.72)',
      'font-size': '9',
    });
    tickLabel.textContent = formatter(value);
    svg.appendChild(tickLabel);
  });

  return scale;
}

function getPaddedDomain(minValue, maxValue, options = {}) {
  const { ratio = 0.08, minPadding = 0.1, clampMin = null } = options;
  const safeMin = Number.isFinite(minValue) ? minValue : 0;
  const safeMax = Number.isFinite(maxValue) ? maxValue : 1;
  const span = Math.max(safeMax - safeMin, 1);
  const pad = Math.max(minPadding, span * ratio);
  let min = safeMin - pad;
  let max = safeMax + pad;
  if (Number.isFinite(clampMin)) {
    min = Math.max(clampMin, min);
  }
  if (max <= min) {
    max = min + 1;
  }
  return { min, max };
}

function renderBarChart(container, labels, values, options = {}) {
  container.innerHTML = '';
  const svgHeight = options.svgHeight || 260;
  const chartHeight = options.chartHeight || 165;
  const svg = createSvgElement('svg', { viewBox: `0 0 360 ${svgHeight}` });
  const maxValue = Math.max(...values, 1);
  const colors = ['#7c3aed', '#16a34a', '#f59e0b', '#0ea5e9', '#ef4444'];

  const chartWidth = 296;
  const paddingLeft = 46;
  const paddingTop = 26;
  const paddingBottom = 68;
  const slotWidth = chartWidth / Math.max(labels.length, 1);
  const barWidth = Math.max(18, Math.min(42, slotWidth * 0.62));
  const startX = paddingLeft + (slotWidth - barWidth) / 2;

  const yDomain = getPaddedDomain(0, maxValue, { ratio: 0.14, minPadding: 1, clampMin: 0 });
  const yScale = drawYAxisScale(svg, {
    paddingLeft,
    topY: paddingTop,
    chartHeight,
    chartWidth,
    minValue: yDomain.min,
    maxValue: yDomain.max,
    tickCount: 5,
    formatter: (value) => String(Math.round(value)),
  });
  svg.appendChild(createSvgElement('line', { x1: paddingLeft, y1: paddingTop, x2: paddingLeft, y2: paddingTop + chartHeight, stroke: 'rgba(255,255,255,0.3)', 'stroke-width': 1 }));
  svg.appendChild(createSvgElement('line', { x1: paddingLeft, y1: paddingTop + chartHeight, x2: paddingLeft + chartWidth, y2: paddingTop + chartHeight, stroke: 'rgba(255,255,255,0.3)', 'stroke-width': 1 }));

  const yAxisTitle = createSvgElement('text', {
    x: 14,
    y: paddingTop + chartHeight / 2,
    transform: `rotate(-90 14 ${paddingTop + chartHeight / 2})`,
    'text-anchor': 'middle',
    fill: 'rgba(255,255,255,0.78)',
    'font-size': '10',
  });
  yAxisTitle.textContent = 'Quantidade de eventos';
  svg.appendChild(yAxisTitle);

  labels.forEach((label, index) => {
    const value = values[index];
    const ySpan = Math.max(yScale.max - yScale.min, 1);
    const valueRatio = (value - yScale.min) / ySpan;
    const barHeight = Math.max(0, Math.min(chartHeight, valueRatio * chartHeight));
    const x = startX + index * slotWidth;
    const y = paddingTop + chartHeight - barHeight;
    const rect = createSvgElement('rect', { x, y, width: barWidth, height: barHeight, rx: 6, fill: colors[index % colors.length] });
    svg.appendChild(rect);

    const tooltipBuilder = () => {
      const total = options.total || values.reduce((sum, current) => sum + current, 0) || 1;
      const share = ((value / total) * 100).toFixed(1);
      const base = `<strong>${options.title || 'Distribuição'}</strong><br>${label}: ${value} eventos (${share}%)`;
      if (options.metaByIndex && options.metaByIndex[index]) {
        return `${base}<br>${options.metaByIndex[index]}`;
      }
      return base;
    };
    attachChartHover(rect, tooltipBuilder);

    const labelY = paddingTop + chartHeight + 18;
    const labelParts = String(label).split(' ');
    if (labelParts.length > 1) {
      const line1 = createSvgElement('text', { x: x + barWidth / 2, y: labelY, 'text-anchor': 'middle', fill: 'rgba(255,255,255,0.8)', 'font-size': '9' });
      line1.textContent = labelParts[0];
      svg.appendChild(line1);

      const line2 = createSvgElement('text', { x: x + barWidth / 2, y: labelY + 12, 'text-anchor': 'middle', fill: 'rgba(255,255,255,0.8)', 'font-size': '9' });
      line2.textContent = labelParts.slice(1).join(' ');
      svg.appendChild(line2);
    } else {
      const labelText = createSvgElement('text', { x: x + barWidth / 2, y: labelY, 'text-anchor': 'middle', fill: 'rgba(255,255,255,0.8)', 'font-size': '9' });
      labelText.textContent = label;
      svg.appendChild(labelText);
    }

    const valueTextY = Math.max(paddingTop + 11, y - 6);
    const valueText = createSvgElement('text', { x: x + barWidth / 2, y: valueTextY, 'text-anchor': 'middle', fill: 'white', 'font-size': '10', 'font-weight': '700' });
    valueText.textContent = value;
    svg.appendChild(valueText);
  });

  const xAxisTitle = createSvgElement('text', {
    x: paddingLeft + chartWidth / 2,
    y: paddingTop + chartHeight + paddingBottom - 12,
    'text-anchor': 'middle',
    fill: 'rgba(255,255,255,0.78)',
    'font-size': '10',
  });
  xAxisTitle.textContent = 'Faixas';
  svg.appendChild(xAxisTitle);

  container.appendChild(svg);
}

function renderLineChart(container, labels, values) {
  const options = arguments.length > 3 && arguments[3] ? arguments[3] : {};
  container.innerHTML = '';
  const svg = createSvgElement('svg', { viewBox: '0 0 320 220' });
  const maxValue = Math.max(...values, 1);
  const paddingLeft = 25;
  const paddingBottom = 35;
  const chartHeight = 150;
  const chartWidth = 280;
  const step = chartWidth / Math.max(labels.length - 1, 1);

  drawYAxisScale(svg, {
    paddingLeft,
    topY: 20,
    chartHeight,
    chartWidth,
    maxValue,
    tickCount: 5,
    formatter: (value) => String(Math.round(value)),
  });

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

    attachChartHover(circle, () => {
      const total = options.total || values.reduce((sum, current) => sum + current, 0) || 1;
      const share = ((values[index] / total) * 100).toFixed(1);
      const base = `<strong>${label}</strong><br>Eventos: ${values[index]} (${share}%)`;
      const extra = options.metaByLabel && options.metaByLabel[label] ? `<br>${options.metaByLabel[label]}` : '';
      return `${base}${extra}`;
    });

    const text = createSvgElement('text', { x, y: y + 20, 'text-anchor': 'middle', fill: 'rgba(255,255,255,0.8)', 'font-size': '9' });
    text.textContent = label.slice(5);
    svg.appendChild(text);
  });

  container.appendChild(svg);
}

const REGION_COLORS = {
  'North America': '#22c55e',
  'South America': '#7c3aed',
  'Asia': '#f59e0b',
  'Europe': '#0ea5e9',
  'Africa': '#ef4444',
  'Oceania': '#8b5cf6',
  [UNKNOWN_REGION]: '#94a3b8',
};

const REGION_LABELS_PT = {
  'North America': 'América do Norte',
  'South America': 'América do Sul',
  'Asia': 'Ásia',
  'Europe': 'Europa',
  'Africa': 'África',
  'Oceania': 'Oceania',
};

let scatterPlotClipCounter = 0;

function formatRegionPt(region) {
  return REGION_LABELS_PT[region] || region || UNKNOWN_REGION;
}

function getRegionColor(region) {
  return REGION_COLORS[region] || REGION_COLORS[UNKNOWN_REGION];
}

function getScatterPointMetric(item, stats) {
  if (stats.sizeMetric === 'significance' && Number.isFinite(item.significance) && item.significance > 0) {
    return item.significance;
  }
  return item.mag;
}

function getScatterPointRadius(item, stats) {
  const metric = getScatterPointMetric(item, stats);
  const { min, max } = stats.sizeDomain;
  const safeSpan = Math.max(max - min, 1);
  const normalized = clampValue((metric - min) / safeSpan, 0, 1);
  return 4 + Math.sqrt(normalized) * 8;
}

function getSummaryIconMarkup(iconType, badgeText = '') {
  if (iconType === 'badge') {
    return `<span class="badge">${badgeText}</span>`;
  }

  const icons = {
    pulse: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12h4l2-4 3 9 2-5h9"/></svg>',
    wave: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12h3l2.2-5 3.4 11 2.5-7h3.2l1.7 3H22"/></svg>',
    arrowDown: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v14"/><path d="M7 12l5 5 5-5"/><path d="M5 21h14"/></svg>',
    bars: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V12"/><path d="M10 20V8"/><path d="M16 20V5"/><path d="M22 20V10"/><path d="M2 20h20"/></svg>',
    delta: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16"/><path d="M8 8l4-4 4 4"/><path d="M8 16l4 4 4-4"/></svg>',
    cluster: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><circle cx="5" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="12" cy="19" r="2"/></svg>',
    target: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M12 7v10"/><path d="M7 12h10"/></svg>',
    pie: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v9h9"/><path d="M21 12a9 9 0 1 1-9-9"/></svg>',
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.8 5.8 6.2.9-4.5 4.4 1.1 6.2L12 17.4l-5.6 2.9 1.1-6.2-4.5-4.4 6.2-.9z"/></svg>',
    info: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 10v6"/><path d="M12 7h.01"/></svg>',
    clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></svg>',
  };

  return icons[iconType] || icons.info;
}

function getScatterTooltip(item, stats) {
  const lines = [];
  lines.push(`<strong>${item.id || 'Evento'}</strong>`);
  lines.push(`Magnitude: ${Number.isFinite(item.mag) ? item.mag.toFixed(1) : '—'}${item.magType ? ` (${item.magType})` : ''}`);
  lines.push(`Profundidade: ${Number.isFinite(item.depth) ? `${item.depth.toFixed(1)} km` : '—'}`);
  if (Number.isFinite(item.latitude) && Number.isFinite(item.longitude)) {
    lines.push(`Latitude: ${item.latitude.toFixed(4)}`);
    lines.push(`Longitude: ${item.longitude.toFixed(4)}`);
  }
  if (item.place) lines.push(`Local: ${item.place}`);
  if (item.country) lines.push(`País: ${item.country}`);
  if (item.region) lines.push(`Região: ${formatRegionPt(item.region)}`);
  if (Number.isFinite(item.timestampMs)) {
    lines.push(`Hora do evento (UTC): ${formatUtcDate(item.timestampMs)} ${formatUtcTime(item.timestampMs)} UTC`);
    const localDateTime = new Date(item.timestampMs).toLocaleString('pt-BR');
    lines.push(`Hora local: ${localDateTime}`);
  }
  if (typeof item.tsunami === 'boolean') lines.push(`Tsunami: ${item.tsunami ? 'Sim' : 'Não'}`);
  if (item.alert) lines.push(`Alerta: ${formatAlert(item.alert)}`);
  if (Number.isFinite(item.felt)) lines.push(`Percebido (felt): ${item.felt}`);
  if (Number.isFinite(item.cdi)) lines.push(`CDI: ${item.cdi.toFixed(1)}`);
  if (Number.isFinite(item.mmi)) lines.push(`MMI: ${item.mmi.toFixed(1)}`);
  if (Number.isFinite(item.significance) && item.significance > 0) lines.push(`Significância USGS: ${Math.round(item.significance)}`);
  lines.push(`Fonte: ${item.source || 'USGS Earthquake Catalog'}`);
  if (item.id === stats.deepestEvent?.id) {
    lines.push('Evento mais profundo: sim');
  }
  if (item.id === stats.maxMagnitudeEvent?.id) {
    lines.push('Maior magnitude: sim');
  }
  return lines.join('<br>');
}

function computeScatterStats(filtered) {
  const magnitudes = filtered.map(item => item.mag).filter(Number.isFinite);
  const depths = filtered.map(item => item.depth).filter(Number.isFinite);
  const significanceValues = filtered
    .map(item => (Number.isFinite(item.significance) && item.significance > 0 ? item.significance : null))
    .filter(value => value !== null);
  const total = filtered.length;
  const maxMagnitudeEvent = filtered.reduce((best, item) => (!best || item.mag > best.mag ? item : best), null);
  const deepestEvent = filtered.reduce((best, item) => (!best || item.depth > best.depth ? item : best), null);

  const magnitudeMin = magnitudes.length ? Math.min(...magnitudes) : 0;
  const magnitudeMax = magnitudes.length ? Math.max(...magnitudes) : 1;
  const depthMin = depths.length ? Math.min(...depths) : 0;
  const depthMax = depths.length ? Math.max(...depths) : 1;
  const depthMedian = getMedian(depths);
  const magnitudeMedian = getMedian(magnitudes);
  const depthMean = depths.length ? depths.reduce((sum, value) => sum + value, 0) / depths.length : 0;
  const magnitudeMean = magnitudes.length ? magnitudes.reduce((sum, value) => sum + value, 0) / magnitudes.length : 0;
  const depthP25 = getPercentile(depths, 25);
  const depthP50 = getPercentile(depths, 50);
  const depthP75 = getPercentile(depths, 75);
  const depthP90 = getPercentile(depths, 90);
  const depthP95 = getPercentile(depths, 95);
  const depthIqr = depthP75 - depthP25;
  const depthUpperFence = depthP75 + Math.max(0, depthIqr * 1.5);
  const depthOutliers = depths.filter(value => value > depthUpperFence).length;
  const mainDepthMax = depthP90 || depthMax;
  const mainCount = depths.filter(value => value <= mainDepthMax).length;
  const deepCount = Math.max(0, total - mainCount);
  const meanMedianGap = Math.abs(depthMean - depthMedian);
  const sizeMetric = significanceValues.length ? 'significance' : 'magnitude';
  const sizeValues = significanceValues.length ? significanceValues : magnitudes;
  const sizeDomain = sizeValues.length
    ? {
        min: Math.min(...sizeValues),
        max: Math.max(getPercentile(sizeValues, 95), Math.max(...sizeValues)),
      }
    : { min: 0, max: 1 };

  const regionCounts = new Map();
  filtered.forEach(item => {
    const region = item.region || UNKNOWN_REGION;
    regionCounts.set(region, (regionCounts.get(region) || 0) + 1);
  });

  const regionLegend = Array.from(regionCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([region, count]) => ({ region, count, color: getRegionColor(region) }));

  return {
    total,
    magnitudes,
    depths,
    magnitudeMin,
    magnitudeMax,
    depthMin,
    depthMax,
    depthMedian,
    magnitudeMedian,
    depthMean,
    magnitudeMean,
    depthP50,
    depthP75,
    depthP90,
    depthP95,
    depthUpperFence,
    depthOutliers,
    mainDepthMax,
    mainCount,
    deepCount,
    meanMedianGap,
    sizeMetric,
    sizeDomain,
    regionLegend,
    maxMagnitudeEvent,
    deepestEvent,
  };
}

function renderScatterPanelSvg(points, stats, depthDomain, title, subtitle, note, isDeepPanel = false) {
  const canvasHeight = 260;
  const svg = createSvgElement('svg', { viewBox: `0 0 760 ${canvasHeight}`, role: 'img', 'aria-label': title });
  const paddingLeft = 64;
  const paddingRight = 24;
  const paddingTop = 48;
  const paddingBottom = 54;
  const chartWidth = 760 - paddingLeft - paddingRight;
  const chartHeight = canvasHeight - paddingTop - paddingBottom;
  const xSourceMin = points.length ? Math.min(...points.map(item => item.mag)) : stats.magnitudeMin;
  const xSourceMax = points.length ? Math.max(...points.map(item => item.mag)) : stats.magnitudeMax;
  const ySourceMin = points.length ? Math.min(...points.map(item => item.depth)) : depthDomain.min;
  const ySourceMax = points.length ? Math.max(...points.map(item => item.depth)) : depthDomain.max;

  const xDomainBase = getPaddedDomain(xSourceMin, xSourceMax, { ratio: 0.1, minPadding: 0.15, clampMin: 0 });
  const yDomainBase = getPaddedDomain(ySourceMin, ySourceMax, {
    ratio: isDeepPanel ? 0.12 : 0.1,
    minPadding: isDeepPanel ? 2 : 1,
    clampMin: 0,
  });

  const maxPointRadius = points.length
    ? Math.max(...points.map(item => getScatterPointRadius(item, stats)))
    : 0;
  const xDomainSpanBase = Math.max(xDomainBase.max - xDomainBase.min, 1);
  const yDomainSpanBase = Math.max(yDomainBase.max - yDomainBase.min, 1);
  const pixelPad = maxPointRadius + 3;
  const xPadFromRadius = (pixelPad / chartWidth) * xDomainSpanBase;
  const yPadFromRadius = (pixelPad / chartHeight) * yDomainSpanBase;

  const xDomain = {
    min: Math.max(0, xDomainBase.min - xPadFromRadius),
    max: xDomainBase.max + xPadFromRadius,
  };
  const yDomain = {
    min: Math.max(0, yDomainBase.min - yPadFromRadius),
    max: yDomainBase.max + yPadFromRadius,
  };

  svg.appendChild(createSvgElement('rect', {
    x: 0,
    y: 0,
    width: 760,
    height: canvasHeight,
    rx: 12,
    fill: 'rgba(255,255,255,0.01)',
    stroke: 'rgba(255,255,255,0.06)',
  }));

  const titleText = createSvgElement('text', {
    x: paddingLeft,
    y: 22,
    fill: 'rgba(255,255,255,0.96)',
    'font-size': '14',
    'font-weight': '700',
  });
  titleText.textContent = title;
  svg.appendChild(titleText);

  const subtitleText = createSvgElement('text', {
    x: paddingLeft,
    y: 40,
    fill: 'rgba(255,255,255,0.62)',
    'font-size': '10.5',
  });
  subtitleText.textContent = subtitle;
  svg.appendChild(subtitleText);

  scatterPlotClipCounter += 1;
  const clipId = `plot-clip-${isDeepPanel ? 'deep' : 'main'}-${scatterPlotClipCounter}`;
  const plotClip = createSvgElement('clipPath', { id: clipId });
  plotClip.appendChild(createSvgElement('rect', {
    x: paddingLeft,
    y: paddingTop,
    width: chartWidth,
    height: chartHeight,
  }));
  svg.appendChild(plotClip);

  const yScale = drawYAxisScale(svg, {
    paddingLeft,
    topY: paddingTop,
    chartHeight,
    chartWidth,
    minValue: yDomain.min,
    maxValue: yDomain.max,
    tickCount: isDeepPanel ? 5 : 6,
    invert: true,
    formatter: (value) => `${formatAxisNumber(value, value >= 100 ? 0 : 1)} km`,
  });

  const xScale = drawXAxisScale(svg, {
    paddingLeft,
    topY: paddingTop,
    chartHeight,
    chartWidth,
    minValue: xDomain.min,
    maxValue: xDomain.max,
    tickCount: 6,
    formatter: (value) => formatAxisNumber(value, value % 1 === 0 ? 0 : 1),
  });

  svg.appendChild(createSvgElement('line', {
    x1: paddingLeft,
    y1: paddingTop,
    x2: paddingLeft,
    y2: paddingTop + chartHeight,
    stroke: 'rgba(255,255,255,0.32)',
    'stroke-width': 1,
  }));
  svg.appendChild(createSvgElement('line', {
    x1: paddingLeft,
    y1: paddingTop + chartHeight,
    x2: paddingLeft + chartWidth,
    y2: paddingTop + chartHeight,
    stroke: 'rgba(255,255,255,0.32)',
    'stroke-width': 1,
  }));

  const xAxisLabel = createSvgElement('text', {
    x: paddingLeft + chartWidth / 2,
    y: canvasHeight - 20,
    'text-anchor': 'middle',
    fill: 'rgba(255,255,255,0.8)',
    'font-size': '11',
  });
  xAxisLabel.textContent = 'Magnitude';
  svg.appendChild(xAxisLabel);

  const yAxisLabel = createSvgElement('text', {
    x: 18,
    y: paddingTop + chartHeight / 2,
    transform: `rotate(-90 18 ${paddingTop + chartHeight / 2})`,
    'text-anchor': 'middle',
    fill: 'rgba(255,255,255,0.8)',
    'font-size': '11',
  });
  yAxisLabel.textContent = 'Profundidade (km)';
  svg.appendChild(yAxisLabel);

  const pointDomain = Math.max(xScale.max - xScale.min, 1);
  const depthSpan = Math.max(yScale.max - yScale.min, 1);
  const sortedPoints = points.slice().sort((a, b) => {
    const diff = getScatterPointMetric(a, stats) - getScatterPointMetric(b, stats);
    if (diff !== 0) return diff;
    return a.depth - b.depth;
  });

  const pointsLayer = createSvgElement('g', { 'clip-path': `url(#${clipId})` });
  svg.appendChild(pointsLayer);

  sortedPoints.forEach(item => {
    const radius = getScatterPointRadius(item, stats);
    const xRaw = paddingLeft + ((item.mag - xScale.min) / pointDomain) * chartWidth;
    const yRaw = paddingTop + ((item.depth - yScale.min) / depthSpan) * chartHeight;
    const x = clampValue(xRaw, paddingLeft + radius + 1, paddingLeft + chartWidth - radius - 1);
    const y = clampValue(yRaw, paddingTop + radius + 1, paddingTop + chartHeight - radius - 1);
    const fill = getRegionColor(item.region);
    const isDeepest = item.id && stats.deepestEvent && item.id === stats.deepestEvent.id;
    const isLargest = item.id && stats.maxMagnitudeEvent && item.id === stats.maxMagnitudeEvent.id;
    const isOutlier = item.depth > stats.depthUpperFence;
    const stroke = isDeepest ? '#f59e0b' : isLargest ? '#22c55e' : isOutlier ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0)';
    const strokeWidth = isDeepest || isLargest || isOutlier ? 2 : 0;

    const circle = createSvgElement('circle', {
      cx: x,
      cy: y,
      r: radius,
      fill,
      opacity: 0.82,
      stroke,
      'stroke-width': strokeWidth,
    });
    pointsLayer.appendChild(circle);

    attachChartHover(circle, () => getScatterTooltip(item, stats));

    if (isDeepest || isLargest) {
      const marker = createSvgElement('text', {
        x: Math.min(paddingLeft + chartWidth - 80, x + 8),
        y: Math.max(paddingTop + 12, y - 8),
        fill: isDeepest ? '#f59e0b' : '#22c55e',
        'font-size': '9',
        'font-weight': '700',
      });
      marker.textContent = isDeepest ? 'Mais profundo' : 'Maior M';
      pointsLayer.appendChild(marker);
    }
  });

  if (note) {
    const noteText = createSvgElement('text', {
      x: paddingLeft,
      y: 354,
      fill: 'rgba(255,255,255,0.7)',
      'font-size': '9',
    });
    noteText.textContent = note;
    svg.appendChild(noteText);
  }

  return svg;
}

function renderScatterChart(container, filtered) {
  container.innerHTML = '';

  if (!filtered.length) {
    container.innerHTML = '<div style="color:rgba(255,255,255,0.7);padding-top:3rem;">Nenhum evento para exibir.</div>';
    if (scatterSummaryEl) scatterSummaryEl.innerHTML = '';
    return;
  }

  const stats = computeScatterStats(filtered);
  const mainRangeLabel = `Faixa principal calculada: 0 - ${formatAxisNumber(stats.mainDepthMax, stats.mainDepthMax >= 100 ? 0 : 1)} km (P90)`;
  const dominantCoverageLabel = `${((stats.mainCount / Math.max(stats.total, 1)) * 100).toFixed(0)}% dos eventos`;
  const sizeLabel = stats.sizeMetric === 'significance' ? 'Tamanho = Significância USGS' : 'Tamanho = magnitude (alternativo)';

  if (scatterSummaryEl) {
    const summaryCards = [
      { iconType: 'pulse', iconClass: 'total', label: 'Total de eventos', value: stats.total, note: 'Eventos reais no recorte atual' },
      { iconType: 'wave', iconClass: 'magnitude', label: 'Magnitude máxima', value: formatAxisNumber(stats.magnitudeMax, 1), note: 'Maior magnitude observada' },
      { iconType: 'arrowDown', iconClass: 'depth', label: 'Profundidade máxima', value: `${formatAxisNumber(stats.depthMax, stats.depthMax >= 100 ? 0 : 1)} km`, note: 'Evento mais profundo' },
      { iconType: 'wave', iconClass: 'stats', label: 'Magnitude mediana', value: formatAxisNumber(stats.magnitudeMedian, 1), note: 'Tendência central da magnitude' },
      { iconType: 'arrowDown', iconClass: 'stats', label: 'Profundidade mediana', value: `${formatAxisNumber(stats.depthMedian, stats.depthMedian >= 100 ? 0 : 1)} km`, note: 'Centro da distribuição' },
      { iconType: 'bars', iconClass: 'stats', label: 'Profundidade média', value: `${formatAxisNumber(stats.depthMean, stats.depthMean >= 100 ? 0 : 1)} km`, note: 'Sensível aos eventos profundos' },
      { iconType: 'delta', iconClass: 'warning', label: '| média - mediana |', value: `${formatAxisNumber(stats.meanMedianGap, stats.meanMedianGap >= 100 ? 0 : 1)} km`, note: 'Assimetria da distribuição' },
      { iconType: 'badge', iconClass: 'percentile', badgeText: 'P90', label: 'P90 profundidade', value: `${formatAxisNumber(stats.depthP90, stats.depthP90 >= 100 ? 0 : 1)} km`, note: 'Faixa principal calculada' },
      { iconType: 'badge', iconClass: 'percentile', badgeText: 'P95', label: 'P95 profundidade', value: `${formatAxisNumber(stats.depthP95, stats.depthP95 >= 100 ? 0 : 1)} km`, note: 'Cauda mais profunda' },
      { iconType: 'wave', iconClass: 'warning', label: 'Eventos profundos', value: stats.deepCount, note: 'Acima da faixa principal' },
      { iconType: 'cluster', iconClass: 'warning', label: 'Outliers profundos', value: stats.depthOutliers, note: 'Tukey fence no limite superior' },
      { iconType: 'target', iconClass: 'range', label: 'Faixa principal (P90)', value: `0 - ${formatAxisNumber(stats.mainDepthMax, stats.mainDepthMax >= 100 ? 0 : 1)} km`, note: `${dominantCoverageLabel} da seleção` },
      { iconType: 'pie', iconClass: 'coverage', label: '% na faixa principal', value: dominantCoverageLabel, note: 'Cobertura da concentração dominante' },
      { iconType: 'star', iconClass: 'size', label: 'Tamanho dos pontos', value: sizeLabel, note: 'Significância quando disponível' },
      { iconType: 'info', iconClass: 'warning', label: 'Observação', value: 'Outliers não significam necessariamente risco', note: 'Interpretação estatística do dataset' },
      { iconType: 'clock', iconClass: 'percentile', label: 'Período dos dados', value: 'Conforme dataset utilizado', note: 'Sem dados sintéticos' },
    ];

    const cardsHtml = summaryCards.map(card => `
      <div class="scatter-summary-card">
        <span class="scatter-summary-icon ${card.iconClass}">${getSummaryIconMarkup(card.iconType, card.badgeText || '')}</span>
        <div>
          <small>${card.label}</small>
          <strong>${card.value}</strong>
          <small>${card.note}</small>
        </div>
      </div>
    `).join('');

    const legendHtml = stats.regionLegend.map(item => `
      <span class="meta-pill"><span style="display:inline-block;width:0.65rem;height:0.65rem;border-radius:999px;background:${item.color};margin-right:0.35rem;vertical-align:middle;"></span>${formatRegionPt(item.region)} (${item.count})</span>
    `).join('');

    scatterSummaryEl.innerHTML = `
      <div class="scatter-summary-grid">${cardsHtml}</div>
      <div class="scatter-region-legend">${legendHtml}</div>
    `;
  }

  const wrapper = document.createElement('div');
  wrapper.style.display = 'grid';
  wrapper.style.gap = '0.9rem';

  const mainPoints = filtered.filter(item => item.depth <= stats.mainDepthMax);
  const deepPoints = filtered.filter(item => item.depth > stats.mainDepthMax);

  const mainPanel = document.createElement('div');
  mainPanel.className = 'scatter-analytical-panel';
  mainPanel.innerHTML = `
    <h4>Distribuição Principal da Sismicidade</h4>
    <p>Faixa dominante baseada em P90 da profundidade. X = magnitude contínua, Y = profundidade (km).</p>
  `;
  mainPanel.appendChild(renderScatterPanelSvg(mainPoints, stats, { min: 0, max: stats.mainDepthMax }, 'Distribuição Principal da Sismicidade', `Faixa principal com ${mainPoints.length} eventos.`, `Evento mais profundo e maior magnitude destacados automaticamente.`, false));
  wrapper.appendChild(mainPanel);

  if (deepPoints.length) {
    const deepPanel = document.createElement('div');
    deepPanel.className = 'scatter-analytical-panel';
    deepPanel.innerHTML = `
      <h4>Eventos Profundos</h4>
      <p>Eventos acima do P90 preservados em escala própria para não distorcer a concentração rasa.</p>
    `;
    deepPanel.appendChild(renderScatterPanelSvg(deepPoints, stats, { min: stats.mainDepthMax, max: stats.depthMax }, 'Eventos Profundos', `Eventos profundos: ${deepPoints.length}.`, `Quebra de escala explícita e orientada por dados; nenhum evento removido.`, true));
    wrapper.appendChild(deepPanel);
  }

  container.appendChild(wrapper);
}

function renderCharts(trendCounts, filtered, magnitudeBands, magnitudeValues, depthBands, depthValues) {

  const trendLabels = trendCounts.map(item => item[0]);
  const trendValues = trendCounts.map(item => item[1]);
  const trendMetaByLabel = {};
  trendLabels.forEach((label, index) => {
    const dayEvents = filtered.filter(item => item.date === label);
    const medianMagDay = getMedian(dayEvents.map(item => item.mag)).toFixed(1);
    const medianDepthDay = getMedian(dayEvents.map(item => item.depth)).toFixed(1);
    const maxMagDay = dayEvents.reduce((max, item) => Math.max(max, item.mag), 0).toFixed(1);
    trendMetaByLabel[label] = `Magn. mediana: ${medianMagDay} • Prof. mediana: ${medianDepthDay} km • Máx: ${maxMagDay}`;
  });

  const totalEvents = filtered.length || 1;
  const magnitudeMeta = magnitudeBands.map((band, index) => {
    if (!magnitudeValues[index]) return 'Sem eventos nesta faixa';
    const minEdge = band === '<2' ? 0 : Number(String(band).split('–')[0]);
    const maxEdge = band === '<2' ? 2 : band === '7+' ? Infinity : Number(String(band).split('–')[1]);
    const bandRows = filtered.filter(item => (band === '<2' ? item.mag < 2 : band === '7+' ? item.mag >= 7 : item.mag >= minEdge && item.mag < maxEdge));
    const medianDepthBand = getMedian(bandRows.map(item => item.depth)).toFixed(1);
    return `Prof. mediana: ${medianDepthBand} km`;
  });

  const depthMeta = depthBands.map((band, index) => {
    if (!depthValues[index]) return 'Sem eventos nesta faixa';
    const bandRows = filtered.filter(item => {
      if (band === '0–10 km') return item.depth >= 0 && item.depth < 10;
      if (band === '10–50 km') return item.depth >= 10 && item.depth < 50;
      if (band === '50–100 km') return item.depth >= 50 && item.depth < 100;
      if (band === '100–300 km') return item.depth >= 100 && item.depth < 300;
      return item.depth >= 300;
    });
    const medianMagBand = getMedian(bandRows.map(item => item.mag)).toFixed(1);
    return `Magn. mediana: ${medianMagBand}`;
  });

  if (trendLabels.length) {
    renderLineChart(trendChartEl, trendLabels, trendValues, {
      total: totalEvents,
      metaByLabel: trendMetaByLabel,
    });
  } else {
    trendChartEl.innerHTML = '<div style="color:rgba(255,255,255,0.7);padding-top:3rem;">Nenhum evento para exibir.</div>';
  }

  if (magnitudeBands && magnitudeValues) {
    renderBarChart(magnitudeChartEl, magnitudeBands, magnitudeValues, {
      title: 'Faixa de magnitude',
      total: totalEvents,
      metaByIndex: magnitudeMeta,
    });
  } else {
    magnitudeChartEl.innerHTML = '<div style="color:rgba(255,255,255,0.7);padding-top:3rem;">Nenhum evento para exibir.</div>';
  }

  if (filtered && filtered.length) {
    renderScatterChart(scatterChartEl, filtered);
  } else {
    scatterChartEl.innerHTML = '<div style="color:rgba(255,255,255,0.7);padding-top:3rem;">Nenhum evento para exibir.</div>';
  }

  if (depthBands && depthValues) {
    renderBarChart(depthChartEl, depthBands, depthValues, {
      title: 'Faixa de profundidade',
      total: totalEvents,
      metaByIndex: depthMeta,
      chartHeight: 92,
      svgHeight: 190,
    });
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
  const currentSeverity = severityFilter ? severityFilter.value : 'all';
  const severityFiltered = currentSeverity === 'all'
    ? filtered
    : filtered.filter(item => getSeverityLabel(item.mag) === currentSeverity);

  const limitValue = detailsLimit ? detailsLimit.value : 'all';
  const sliced = limitValue === 'all' ? severityFiltered : severityFiltered.slice(0, Number(limitValue));

  detailsTable.innerHTML = sliced.length ? sliced.map(item => {
    const severity = getSeverityLabel(item.mag);
    const score = getSeismicScore(item);
    const enrichedLocation = [item.city, item.nearestCity].filter(Boolean).join(' • ') || item.place;
    const locationMeta = enrichedLocation && enrichedLocation !== item.place
      ? `<br><small style="color:rgba(255,255,255,0.6);">${enrichedLocation}</small>`
      : '';
    const eventTimeUtc = Number.isFinite(item.timestampMs) ? formatUtcTime(item.timestampMs) : null;
    const dateTimeLabel = eventTimeUtc ? `${item.date} ${eventTimeUtc} UTC` : `${item.date} --:--:--`;
    return `
      <tr>
        <td>${item.id}</td>
        <td>${item.place}${locationMeta}</td>
        <td>${formatRegionPt(item.region)}</td>
        <td>${item.country}</td>
        <td>${dateTimeLabel}</td>
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
  const placeDetails = parsePlaceDetails(props.place);
  const country = normalizeCountryValue(props.country, inferredGeo.country, props.place);
  const region = normalizeRegionValue(props.region, country, inferredGeo.region);
  return {
    id: feature.id,
    place: props.place,
    region,
    country,
    city: props.city || placeDetails.inferredCity || null,
    nearestCity: props.nearest_city || placeDetails.inferredCity || null,
    countryCode: props.country_code || null,
    date: new Date(props.time).toISOString().slice(0, 10),
    timestampMs: Number(props.time),
    mag: Number(props.mag || 0),
    magType: props.magType || null,
    depth: Number(coords[2] || 0),
    latitude: Number(coords[1]),
    longitude: Number(coords[0]),
    tsunami: Boolean(props.tsunami),
    alert: props.alert || null,
    felt: Number(props.felt || props.felt_count || 0) || null,
    cdi: Number(props.cdi || 0) || null,
    mmi: Number(props.mmi || 0) || null,
    significance: Number(props.sig || props.significance || 0),
    source: props.sources || props.net || 'USGS Earthquake Catalog',
    distanceToCityKm: Number(props.distance_to_city_km || 0) || placeDetails.inferredDistanceKm || null
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
    const placeDetails = parsePlaceDetails(place);
    const country = normalizeCountryValue(item.country, inferredGeo.country, place);
    const region = normalizeRegionValue(item.region, country, inferredGeo.region);
    return {
      ...item,
      region,
      country,
      city: item.city || placeDetails.inferredCity || null,
      nearestCity: item.nearestCity || item.nearest_city || placeDetails.inferredCity || null,
    date: String(item.date || ''),
    timestampMs: Number(item.timestampMs || item.time || 0) || null,
    mag: Number(item.mag || 0),
    magType: item.magType || item.magnitude_type || null,
    depth: Number(item.depth || 0),
    latitude: Number(item.latitude),
    longitude: Number(item.longitude),
    tsunami: Boolean(item.tsunami),
    alert: item.alert || null,
    felt: Number(item.felt || 0) || null,
    cdi: Number(item.cdi || 0) || null,
    mmi: Number(item.mmi || 0) || null,
    significance: Number(item.significance || item.sig || 0),
    source: item.source || 'USGS Earthquake Catalog',
    countryCode: item.countryCode || item.country_code || null,
    distanceToCityKm: Number(item.distanceToCityKm || item.distance_to_city_km || 0) || placeDetails.inferredDistanceKm || null,
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

  if (severityFilter) {
    severityFilter.addEventListener('change', () => {
      updateDashboard();
    });
  }

  if (refreshButton) {
    refreshButton.addEventListener('click', refreshDashboardData);
  }

  if (datasetModeFilter) {
    datasetModeFilter.addEventListener('change', changeDatasetMode);
  }

  if (mapAssetLayerFilter) {
    mapAssetLayerFilter.addEventListener('change', () => {
      updateDashboard();
    });
  }

  if (exportButton) {
    exportButton.addEventListener('click', () => {
      exportFilteredData(getFilteredData());
    });
  }

  if (toggleAnswersPanelBtn && answersPanelContent) {
    toggleAnswersPanelBtn.addEventListener('click', () => {
      togglePanelContent(toggleAnswersPanelBtn, answersPanelContent);
    });
  }

  if (toggleWellComparisonPanelBtn && wellComparisonPanelContent) {
    toggleWellComparisonPanelBtn.addEventListener('click', () => {
      togglePanelContent(toggleWellComparisonPanelBtn, wellComparisonPanelContent);
    });
  }

  resetButton.addEventListener('click', () => {
    resetDimensionFilters();
    updateDashboard();
  });
}

function initDashboard() {
  const initialMode = datasetModeFilter ? datasetModeFilter.value : 'latest_24h';
  ensureAnpWellsLoaded();
  loadDashboardDataFromApi(initialMode).then(() => {
    initFilters();
    updateDashboard();
  });
}

initDashboard();
