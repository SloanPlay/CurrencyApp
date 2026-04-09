// popularRates.js
import { getLatest } from "./api.js";

// Monedas más populares para mostrar en la tabla
const POPULAR_PAIRS = [
    { from: "USD", to: "EUR" },
    { from: "USD", to: "GBP" },
    { from: "USD", to: "JPY" },
    { from: "USD", to: "CAD" },
    { from: "USD", to: "AUD" },
    { from: "USD", to: "CHF" },
    { from: "EUR", to: "GBP" },
    { from: "EUR", to: "JPY" },
    { from: "GBP", to: "JPY" },
    { from: "USD", to: "DOP" }
];

// Símbolos de moneda para mostrar
const CURRENCY_SYMBOLS = {
    USD: '$', EUR: '€', GBP: '£', JPY: '¥',
    CAD: 'C$', AUD: 'A$', CHF: 'Fr', DOP: 'RD$'
};

// Cache para tasas de cambio
let ratesCache = new Map();

export async function initializePopularRatesTable() {
    const tableBody = document.getElementById('ratesTableBody');

    // Mostrar skeleton loading
    showSkeletonLoading(tableBody);

    try {
        // Obtener todas las tasas en paralelo
        const ratePromises = POPULAR_PAIRS.map(pair =>
            fetchPairRate(pair.from, pair.to)
        );

        const rates = await Promise.all(ratePromises);

        // Renderizar la tabla con los datos obtenidos
        renderRatesTable(tableBody, rates);

        // Iniciar actualizaciones periódicas cada 120 segundos
        setInterval(async () => {
            await updateRatesTable();
        }, 1200000);

    } catch (error) {
        console.error('Error loading popular rates:', error);
        showErrorState(tableBody);
    }
}

async function fetchPairRate(from, to) {
    try {
        const cacheKey = `${from}-${to}`;
        const data = await getLatest(from);

        // Obtener la tasa de conversión
        const rate = data.conversion_rates[to];

        // Guardar en cache
        ratesCache.set(cacheKey, {
            rate,
            timestamp: Date.now(),
            from,
            to
        });

        return {
            from,
            to,
            rate,
            change: calculateMockChange(rate) // Simulación de cambio 24h
        };
    } catch (error) {
        console.error(`Error fetching ${from}/${to}:`, error);
        return {
            from,
            to,
            rate: null,
            change: null
        };
    }
}

function calculateMockChange(currentRate) {
    // Simular un cambio porcentual (en producción usarías datos históricos reales)
    const mockChange = (Math.random() * 2 - 1) * 1.5; // Entre -1.5% y +1.5%
    return {
        percentage: mockChange,
        value: (currentRate * mockChange) / 100
    };
}

function renderRatesTable(tableBody, rates) {
    if (!tableBody) return;

    tableBody.innerHTML = '';

    rates.forEach(rateData => {
        const row = createTableRow(rateData);
        tableBody.appendChild(row);
    });

    // Agregar animación de entrada
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach((row, index) => {
        row.style.animation = `fadeInUp 0.5s ease ${index * 0.05}s backwards`;
    });
}

function createTableRow({ from, to, rate, change }) {
    const row = document.createElement('tr');

    // Columna From
    const fromCell = document.createElement('td');
    fromCell.innerHTML = `
        <div class="currency-cell">
            <span class="currency-code">${from}</span>
            <span class="currency-symbol">${CURRENCY_SYMBOLS[from] || ''}</span>
        </div>
    `;

    // Columna To
    const toCell = document.createElement('td');
    toCell.innerHTML = `
        <div class="currency-cell">
            <span class="currency-code">${to}</span>
            <span class="currency-symbol">${CURRENCY_SYMBOLS[to] || ''}</span>
        </div>
    `;

    // Columna Rate
    const rateCell = document.createElement('td');
    if (rate) {
        rateCell.innerHTML = `
            <div class="rate-cell">
                <span class="rate-value">${rate.toFixed(4)}</span>
            </div>
        `;
    } else {
        rateCell.innerHTML = '<span class="error-text">Failed to load</span>';
    }

    // Columna Change
    const changeCell = document.createElement('td');
    if (change) {
        const isPositive = change.percentage >= 0;
        changeCell.innerHTML = `
            <div class="change-cell ${isPositive ? 'positive' : 'negative'}">
                <span class="change-icon">${isPositive ? '▲' : '▼'}</span>
                <span class="change-value">${Math.abs(change.percentage).toFixed(2)}%</span>
            </div>
        `;
    } else {
        changeCell.innerHTML = '<span class="error-text">-</span>';
    }

    row.appendChild(fromCell);
    row.appendChild(toCell);
    row.appendChild(rateCell);
    row.appendChild(changeCell);

    return row;
}

function showSkeletonLoading(tableBody) {
    tableBody.innerHTML = '';

    // Crear 10 filas de skeleton
    for (let i = 0; i < 10; i++) {
        const row = document.createElement('tr');
        row.className = 'skeleton-row';
        row.innerHTML = `
            <td><div class="skeleton"></div></td>
            <td><div class="skeleton"></div></td>
            <td><div class="skeleton"></div></td>
            <td><div class="skeleton"></div></td>
        `;
        tableBody.appendChild(row);
    }
}

function showErrorState(tableBody) {
    tableBody.innerHTML = `
        <tr>
            <td colspan="4" class="error-cell">
                <span class="error-icon">⚠️</span>
                Failed to load rates. Please refresh.
            </td>
        </tr>
    `;
}

async function updateRatesTable() {
    const tableBody = document.getElementById('ratesTableBody');
    if (!tableBody) return;

    try {
        const ratePromises = POPULAR_PAIRS.map(pair =>
            fetchPairRate(pair.from, pair.to)
        );

        const rates = await Promise.all(ratePromises);
        renderRatesTable(tableBody, rates);

        // Efecto visual de actualización
        tableBody.style.transition = 'opacity 0.3s';
        tableBody.style.opacity = '0.7';
        setTimeout(() => {
            tableBody.style.opacity = '1';
        }, 300);

    } catch (error) {
        console.error('Error updating rates:', error);
    }
}

// Función para obtener tasa específica (útil para otras partes de la app)
export function getCachedRate(from, to) {
    const cacheKey = `${from}-${to}`;
    const cached = ratesCache.get(cacheKey);

    if (cached && (Date.now() - cached.timestamp) < 300000) { // 5 minutos de cache
        return cached.rate;
    }

    return null;
}