document.getElementById('stockForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const symbol = document.getElementById('symbol').value.trim().toUpperCase();
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = '';
    if (!symbol) {
        errorDiv.textContent = 'Please enter a stock symbol.';
        return;
    }
    try {
        const response = await fetch(`http://localhost:5000/stock?symbol=${symbol}`);
        const data = await response.json();
        if (!response.ok || data.error) {
            errorDiv.textContent = data.error || 'Failed to fetch stock data.';
            return;
        }
        renderChart(symbol, data.times, data.prices);
    } catch (err) {
        errorDiv.textContent = 'Error fetching data.';
    }
});

let chart;
function renderChart(symbol, times, prices) {
    const ctx = document.getElementById('stockChart').getContext('2d');
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: times,
            datasets: [{
                label: `${symbol} Price`,
                data: prices,
                borderColor: '#66a6ff',
                backgroundColor: 'rgba(102,166,255,0.1)',
                pointRadius: 2,
                fill: true,
                tension: 0.2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true },
                title: { display: false }
            },
            scales: {
                x: { display: true, title: { display: true, text: 'Time' } },
                y: { display: true, title: { display: true, text: 'Price (USD)' } }
            }
        }
    });
}
