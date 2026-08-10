const regionFilter = document.getElementById('regionFilter');
const countryFilter = document.getElementById('countryFilter');
const yearFilter = document.getElementById('yearFilter');
const monthFilter = document.getElementById('monthFilter');
const dayFilter = document.getElementById('dayFilter');
const resetButton = document.getElementById('resetFilters');

const regionChartEl = document.getElementById('regionChart');
const trendChartEl = document.getElementById('trendChart');
const countryChartEl = document.getElementById('countryChart');

const kpiEvents = document.getElementById('kpiEvents');
const kpiMagnitude = document.getElementById('kpiMagnitude');
const kpiDepth = document.getElementById('kpiDepth');
const kpiLastDate = document.getElementById('kpiLastDate');
const summaryText = document.getElementById('summaryText');
const topRegion = document.getElementById('topRegion');
const topCountry = document.getElementById('topCountry');
const topMagnitude = document.getElementById('topMagnitude');
const detailsTable = document.getElementById('detailsTable');
const detailsLimit = document.getElementById('detailsLimit');

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

function updateDashboard() {
  const filtered = getFilteredData();
  if (!filtered.length) {
    kpiEvents.textContent = '0';
    kpiMagnitude.textContent = '0.0';
    kpiDepth.textContent = '0.0';
    kpiLastDate.textContent = '—';
    topRegion.textContent = '—';
    topCountry.textContent = '—';
    topMagnitude.textContent = '—';
    summaryText.innerHTML = '<strong>Sem dados para esta seleção.</strong>';
    renderCharts([], [], []);
    renderDetails([]);
    return;
  }
  const count = filtered.length;
  const avgMag = count ? (filtered.reduce((sum, item) => sum + item.mag, 0) / count).toFixed(1) : '0.0';
  const avgDepth = count ? (filtered.reduce((sum, item) => sum + item.depth, 0) / count).toFixed(1) : '0.0';
  const lastDate = count ? filtered.slice().sort((a,b) => new Date(b.date) - new Date(a.date))[0].date : '—';

  kpiEvents.textContent = count;
  kpiMagnitude.textContent = avgMag;
  kpiDepth.textContent = avgDepth;
  kpiLastDate.textContent = lastDate;

  const regionCounts = Object.entries(filtered.reduce((acc, item) => {
    acc[item.region] = (acc[item.region] || 0) + 1;
    return acc;
  }, {})).sort((a,b) => b[1] - a[1]);

  const countryCounts = Object.entries(filtered.reduce((acc, item) => {
    acc[item.country] = (acc[item.country] || 0) + 1;
    return acc;
  }, {})).sort((a,b) => b[1] - a[1]);

  const trendCounts = Object.entries(filtered.reduce((acc, item) => {
    acc[item.date] = (acc[item.date] || 0) + 1;
    return acc;
  }, {})).sort((a,b) => a[0].localeCompare(b[0]));

  const topRegionItem = regionCounts[0] ? regionCounts[0][0] : '—';
  const topCountryItem = countryCounts[0] ? countryCounts[0][0] : '—';
  const topMagnitudeItem = filtered.length ? filtered.reduce((max, item) => item.mag > max.mag ? item : max, filtered[0]).mag.toFixed(1) : '—';

  topRegion.textContent = topRegionItem;
  topCountry.textContent = topCountryItem;
  topMagnitude.textContent = topMagnitudeItem;

  summaryText.innerHTML = `<strong>Seleção atual:</strong> ${count} eventos, magnitude média ${avgMag} e profundidade média ${avgDepth} km. ${topRegionItem !== '—' ? `Região dominante: ${topRegionItem}.` : ''}`;

  renderCharts(regionCounts, trendCounts, countryCounts);
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

function renderCharts(regionCounts, trendCounts, countryCounts) {
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

  if (countryLabels.length) {
    renderDonutChart(countryChartEl, countryLabels, countryValues);
  } else {
    countryChartEl.innerHTML = '<div style="color:rgba(255,255,255,0.7);padding-top:3rem;">Nenhum evento para exibir.</div>';
  }
}

function renderDetails(filtered) {
  const limitValue = detailsLimit ? detailsLimit.value : 'all';
  const sliced = limitValue === 'all' ? filtered : filtered.slice(0, Number(limitValue));

  detailsTable.innerHTML = sliced.length ? sliced.map(item => `
    <tr>
      <td>${item.id}</td>
      <td>${item.place}</td>
      <td>${item.region}</td>
      <td>${item.country}</td>
      <td>${item.date}</td>
      <td>${item.mag.toFixed(1)}</td>
      <td>${item.depth.toFixed(1)}</td>
    </tr>
  `).join('') : '<tr><td colspan="7">Nenhum evento encontrado para os filtros aplicados.</td></tr>';
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
    detailsLimit.addEventListener('change', () => updateDashboard());
  }

  resetButton.addEventListener('click', () => {
    [regionFilter, countryFilter, yearFilter, monthFilter, dayFilter].forEach(select => select.value = '');
    updateDashboard();
  });
}

initFilters();
updateDashboard();
