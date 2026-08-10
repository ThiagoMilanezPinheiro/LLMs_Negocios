const regionFilter = document.getElementById('regionFilter');
const countryFilter = document.getElementById('countryFilter');
const yearFilter = document.getElementById('yearFilter');
const monthFilter = document.getElementById('monthFilter');
const dayFilter = document.getElementById('dayFilter');
const resetButton = document.getElementById('resetFilters');
const refreshButton = document.getElementById('refreshData');
const exportButton = document.getElementById('exportData');

const regionChartEl = document.getElementById('regionChart');
const trendChartEl = document.getElementById('trendChart');
const countryChartEl = document.getElementById('countryChart');
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

function getDashboardData() {
  if (window.dashboardData && Array.isArray(window.dashboardData)) {
    return window.dashboardData;
  }
  if (typeof data !== 'undefined' && Array.isArray(data)) {
    return data;
  }
  return [];
}

function populateSelect(select, values) {
  const uniqueValues = [...new Set(values.filter(Boolean))].sort();
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

function getFilteredData() {
  const dashboardData = getDashboardData();
  const region = regionFilter.value;
  const country = countryFilter.value;
  const year = yearFilter.value;
  const month = monthFilter.value;
  const day = dayFilter.value;

  return dashboardData.filter(item => {
    const date = new Date(item.date);
    const matchesRegion = !region || item.region === region;
    const matchesCountry = !country || item.country === country;
    const matchesYear = !year || date.getFullYear().toString() === year;
    const matchesMonth = !month || (date.getMonth() + 1).toString() === month;
    const matchesDay = !day || date.getDate().toString() === day;
    return matchesRegion && matchesCountry && matchesYear && matchesMonth && matchesDay;
  });
}

function getSeverityLabel(magnitude) {
  if (magnitude >= 7) return 'MAJOR';
  if (magnitude >= 6) return 'HIGH';
  if (magnitude >= 5) return 'SIGNIFICANT';
  if (magnitude >= 4) return 'MODERATE';
  return 'LOW';
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
  if (label === 'MAJOR') return 'severity-major';
  if (label === 'HIGH') return 'severity-high';
  if (label === 'SIGNIFICANT') return 'severity-significant';
  if (label === 'MODERATE') return 'severity-moderate';
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
  const depths = filtered.map(item => item.depth).sort((a, b) => a - b);
  const mid = Math.floor(depths.length / 2);
  const medianDepth = depths.length % 2 === 0 ? (depths[mid - 1] + depths[mid]) / 2 : depths[mid];
  const avgMag = (filtered.reduce((sum, item) => sum + item.mag, 0) / count).toFixed(1);
  const avgDepth = (filtered.reduce((sum, item) => sum + item.depth, 0) / count).toFixed(1);
  const lastDate = filtered.slice().sort((a, b) => new Date(b.date) - new Date(a.date))[0].date;

  kpiEvents.textContent = count;
  kpiM4.textContent = m4Events;
  kpiM5.textContent = m5Events;
  kpiMaxMag.textContent = maxMag.toFixed(1);
  kpiMedianDepth.textContent = medianDepth.toFixed(1);
  kpiLastDate.textContent = lastDate;

  const regionCounts = Object.entries(filtered.reduce((acc, item) => {
    acc[item.region] = (acc[item.region] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]);

  const countryCounts = Object.entries(filtered.reduce((acc, item) => {
    acc[item.country] = (acc[item.country] || 0) + 1;
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
      avgMagnitude: regionEvents.reduce((sum, item) => sum + item.mag, 0) / regionEvents.length
    };
  }).sort((a, b) => b.avgMagnitude - a.avgMagnitude);
  const mostIntenseRegion = regionIntensity[0] || { name: '—', count: 0, avgMagnitude: 0 };

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
  const temporalInsight = dayValues.length >= 2 ? (dayValues.length > 1 ? `${dayValues.length} days in the selected range` : 'Single-day sample') : 'Insufficient data';
  const magnitudeProfile = magnitudeValues.reduce((maxIndex, value, index) => value > magnitudeValues[maxIndex] ? index : maxIndex, 0);
  const dominantBand = magnitudeBands[magnitudeProfile];
  const dominantBandCount = magnitudeValues[magnitudeProfile];

  topRegion.textContent = topRegionItem;
  topCountry.textContent = topCountryItem;
  topMagnitude.textContent = `${topMagnitudeItem} (${topMagnitudePlace})`;

  summaryText.innerHTML = `<strong>Analytical Severity:</strong> ${getSeverityLabel(maxMag)} • ${count} events • median depth ${medianDepth.toFixed(1)} km • dominant region ${topRegionItem}.`;
  topSummaryEl.innerHTML = `<strong>${topRegionItem}</strong> concentrates ${regionCounts[0] ? regionCounts[0][1] : 0} events, while the largest event reached magnitude ${topMagnitudeItem} in ${topMagnitudePlace}.`;

  insightHighestEl.textContent = `${maxMag.toFixed(1)} M`; 
  insightHighestMetaEl.textContent = `${topMagnitudePlace} • ${lastDate}`;
  insightRegionEl.textContent = `${topRegionItem}`;
  insightRegionMetaEl.textContent = `${regionCounts[0] ? regionCounts[0][1] : 0} events • ${((regionCounts[0] ? regionCounts[0][1] : 0) / count * 100).toFixed(0)}% of total`;
  insightMagnitudeBandEl.textContent = dominantBand;
  insightMagnitudeMetaEl.textContent = `${dominantBandCount} events • ${((dominantBandCount / count) * 100).toFixed(0)}% of selection`;
  insightTemporalEl.textContent = temporalInsight;
  insightTemporalMetaEl.textContent = `Average magnitude ${avgMag} • average depth ${avgDepth} km`;

  lastUpdatedEl.textContent = `Última atualização: ${new Date().toLocaleString('pt-BR')}`;
  dataSourceEl.textContent = window.dashboardSource === 'api' ? 'Fonte: USGS Earthquake Catalog (ao vivo)' : 'Fonte: dados locais / fallback';
  recordsLoadedEl.textContent = `Eventos carregados: ${dashboardData.length}`;
  dateRangeEl.textContent = `Período: ${filtered[0] ? filtered[0].date : '—'} → ${lastDate}`;

  answerListEl.innerHTML = `
    <div class="answer-item"><strong>Onde acontecem?</strong><br>Os eventos estão mais concentrados em ${topRegionItem} e, dentro desse contexto, ${topCountryItem} aparece como o principal foco da seleção.</div>
    <div class="answer-item"><strong>Quais são os mais relevantes?</strong><br>O evento mais relevante na seleção é ${topEvent.place} com magnitude ${topEvent.mag.toFixed(1)} e score ${getSeismicScore(topEvent)}.</div>
    <div class="answer-item"><strong>A atividade está aumentando ou diminuindo?</strong><br>A tendência observada é ${trendStatus} ao longo do intervalo analisado.</div>
    <div class="answer-item"><strong>Existe relação entre magnitude e profundidade?</strong><br>A correlação estimada é ${correlationLabel} (${correlation.toFixed(2)}), o que sugere ${correlation > 0.3 ? 'tendência de eventos mais fortes em maiores profundidades' : correlation < -0.3 ? 'tendência de eventos mais fortes em menores profundidades' : 'pouca relação linear entre os dois parâmetros'}.</div>
    <div class="answer-item"><strong>Quais regiões apresentam maior intensidade?</strong><br>${mostIntenseRegion.name} registra a maior magnitude média da seleção: ${mostIntenseRegion.avgMagnitude.toFixed(1)} M em ${mostIntenseRegion.count} eventos.</div>
    <div class="answer-item"><strong>Qual foi o evento mais significativo?</strong><br>${topEvent.place} foi o ponto mais significativo da seleção, com magnitude ${topEvent.mag.toFixed(1)} e severidade ${getSeverityLabel(topEvent.mag)}.</div>
  `;

  const attentionItems = filtered.filter(item => item.mag >= 5 || item.tsunami || item.alert || item.mag >= 6 || (item.significance || 0) >= 50)
    .sort((a, b) => b.mag - a.mag)
    .slice(0, 5);
  attentionListEl.innerHTML = attentionItems.length ? attentionItems.map(item => {
    const severity = getSeverityLabel(item.mag);
    return `<div class="attention-item"><strong>${item.place}</strong><br><small>${item.date} • M ${item.mag.toFixed(1)} • ${item.country}</small><br><span class="severity-pill ${getSeverityClass(severity)}">${severity}</span></div>`;
  }).join('') : '<div class="attention-item"><strong>No attention events in current selection.</strong></div>';

  renderCharts(regionCounts, trendCounts, countryCounts, filtered, magnitudeBands, magnitudeValues, depthBands, depthValues);
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

function renderDonutChart(container, labels, values) {
  container.innerHTML = '';
  const size = 180;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const colors = ['#7c3aed', '#16a34a', '#f59e0b', '#0ea5e9', '#ef4444'];
  const total = values.reduce((sum, value) => sum + value, 0);
  let offset = 0;

  const svg = createSvgElement('svg', { viewBox: '0 0 220 220' });
  const baseCircle = createSvgElement('circle', { cx: 110, cy: 110, r: radius, fill: 'none', stroke: 'rgba(255,255,255,0.12)', 'stroke-width': 30 });
  svg.appendChild(baseCircle);

  values.forEach((value, index) => {
    const segment = (value / total) * circumference;
    const circle = createSvgElement('circle', { cx: 110, cy: 110, r: radius, fill: 'none', stroke: colors[index % colors.length], 'stroke-width': 30, 'stroke-dasharray': `${segment} ${circumference - segment}`, 'stroke-dashoffset': -offset, transform: 'rotate(-90 110 110)' });
    svg.appendChild(circle);
    offset += segment;
  });

  const centerText = createSvgElement('text', { x: 110, y: 110, 'text-anchor': 'middle', 'dominant-baseline': 'middle', fill: 'white', 'font-size': '20' });
  centerText.textContent = total;
  svg.appendChild(centerText);

  const legend = document.createElement('div');
  legend.style.display = 'grid';
  legend.style.gridTemplateColumns = 'repeat(auto-fit, minmax(100px, 1fr))';
  legend.style.gap = '0.4rem';
  legend.style.marginTop = '0.6rem';
  legend.innerHTML = labels.map((label, index) => `<div style="font-size:0.85rem;color:rgba(255,255,255,0.85)"><span style="color:${colors[index % colors.length]}">■</span> ${label}</div>`).join('');

  container.innerHTML = '';
  container.appendChild(svg);
  container.appendChild(legend);
}

function renderCharts(regionCounts, trendCounts, countryCounts, filtered, magnitudeBands, magnitudeValues, depthBands, depthValues) {
  const regionLabels = regionCounts.map(item => item[0]);
  const regionValues = regionCounts.map(item => item[1]);

  const trendLabels = trendCounts.map(item => item[0]);
  const trendValues = trendCounts.map(item => item[1]);

  const countryLabels = countryCounts.map(item => item[0]);
  const countryValues = countryCounts.map(item => item[1]);

  if (regionLabels.length) {
    renderBarChart(regionChartEl, regionLabels, regionValues);
  } else {
    regionChartEl.innerHTML = '<div style="color:rgba(255,255,255,0.7);padding-top:3rem;">Nenhum evento para exibir.</div>';
  }

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

  if (countryLabels.length) {
    renderDonutChart(countryChartEl, countryLabels, countryValues);
  } else {
    countryChartEl.innerHTML = '<div style="color:rgba(255,255,255,0.7);padding-top:3rem;">Nenhum evento para exibir.</div>';
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
    return `
      <tr>
        <td>${item.id}</td>
        <td>${item.place}<br><small style="color:rgba(255,255,255,0.6);">${enrichedLocation}</small></td>
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
  return {
    id: feature.id,
    place: props.place,
    region: props.region || 'Outros',
    country: props.country || 'Outros',
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

function loadDashboardDataFromApi() {
  return fetch('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&eventtype=earthquake&orderby=time&limit=100&minmagnitude=2.5')
    .then(response => {
      if (!response.ok) {
        throw new Error('Falha ao buscar dados');
      }
      return response.json();
    })
    .then(payload => {
      const normalized = (payload.features || []).map(normalizeFeature);
      window.dashboardData = normalized;
      window.dashboardSource = 'api';
      return normalized;
    })
    .catch(() => {
      window.dashboardSource = 'fallback';
      return getDashboardData();
    });
}

function refreshDashboardData() {
  if (!refreshButton) return;

  refreshButton.disabled = true;
  refreshButton.textContent = 'Atualizando...';

  loadDashboardDataFromApi()
    .then(() => {
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

function initFilters() {
  const dashboardData = getDashboardData();
  populateSelect(regionFilter, dashboardData.map(item => item.region));
  populateSelect(countryFilter, dashboardData.map(item => item.country));
  populateSelect(yearFilter, dashboardData.map(item => new Date(item.date).getFullYear().toString()));
  populateSelect(monthFilter, dashboardData.map(item => (new Date(item.date).getMonth() + 1).toString()));
  populateSelect(dayFilter, dashboardData.map(item => new Date(item.date).getDate().toString()));

  [regionFilter, countryFilter, yearFilter, monthFilter, dayFilter].forEach(select => {
    select.addEventListener('change', updateDashboard);
  });

  if (detailsLimit) {
    detailsLimit.addEventListener('change', () => {
      updateDashboard();
    });
  }

  if (refreshButton) {
    refreshButton.addEventListener('click', refreshDashboardData);
  }

  if (exportButton) {
    exportButton.addEventListener('click', () => {
      exportFilteredData(getFilteredData());
    });
  }

  resetButton.addEventListener('click', () => {
    [regionFilter, countryFilter, yearFilter, monthFilter, dayFilter].forEach(select => select.value = '');
    updateDashboard();
  });
}

function initDashboard() {
  loadDashboardDataFromApi().then(() => {
    initFilters();
    updateDashboard();
  });
}

initDashboard();
