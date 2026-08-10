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

function populateSelect(select, values, label) {
  const options = [...new Set(values)].sort();
  options.forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function getFilteredData() {
  const region = regionFilter.value;
  const country = countryFilter.value;
  const year = yearFilter.value;
  const month = monthFilter.value;
  const day = dayFilter.value;

  return data.filter(item => {
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

function renderCharts(regionCounts, trendCounts, countryCounts) {
  const regionLabels = regionCounts.map(item => item[0]);
  const regionValues = regionCounts.map(item => item[1]);

  const trendLabels = trendCounts.map(item => item[0]);
  const trendValues = trendCounts.map(item => item[1]);

  const countryLabels = countryCounts.map(item => item[0]);
  const countryValues = countryCounts.map(item => item[1]);

  if (window.regionChart) window.regionChart.destroy();
  if (window.trendChart) window.trendChart.destroy();
  if (window.countryChart) window.countryChart.destroy();

  window.regionChart = new Chart(regionChartEl, {
    type: 'bar',
    data: {
      labels: regionLabels,
      datasets: [{ label: 'Eventos', data: regionValues, backgroundColor: ['#7c3aed','#16a34a','#f59e0b','#0ea5e9','#ef4444'] }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });

  window.trendChart = new Chart(trendChartEl, {
    type: 'line',
    data: {
      labels: trendLabels,
      datasets: [{ label: 'Eventos', data: trendValues, borderColor: '#7c3aed', backgroundColor: 'rgba(124,58,237,0.2)', tension: 0.35, fill: true }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });

  window.countryChart = new Chart(countryChartEl, {
    type: 'doughnut',
    data: {
      labels: countryLabels,
      datasets: [{ data: countryValues, backgroundColor: ['#7c3aed','#16a34a','#f59e0b','#0ea5e9','#ef4444'] }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
  });
}

function renderDetails(filtered) {
  detailsTable.innerHTML = filtered.length ? filtered.map(item => `
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
  populateSelect(regionFilter, data.map(item => item.region), 'Região');
  populateSelect(countryFilter, data.map(item => item.country), 'País');
  populateSelect(yearFilter, data.map(item => new Date(item.date).getFullYear().toString()), 'Ano');
  populateSelect(monthFilter, data.map(item => (new Date(item.date).getMonth() + 1).toString()), 'Mês');
  populateSelect(dayFilter, data.map(item => new Date(item.date).getDate().toString()), 'Dia');

  [regionFilter, countryFilter, yearFilter, monthFilter, dayFilter].forEach(select => {
    select.addEventListener('change', updateDashboard);
  });

  resetButton.addEventListener('click', () => {
    [regionFilter, countryFilter, yearFilter, monthFilter, dayFilter].forEach(select => select.value = '');
    updateDashboard();
  });
}

initFilters();
updateDashboard();
