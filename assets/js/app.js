import { getCodes } from "./api.js";
import { convertCurrency } from "../../services/exchangeService.js";
import { populateSelect, showResult } from "./ui.js";
import { parseAmount } from "./utils.js";
import { initializePopularRatesTable } from "./popularRates.js";

const amountInput = document.getElementById("amount");
const fromSelect = document.getElementById("fromCurrency");
const toSelect = document.getElementById("toCurrency");
const resultText = document.getElementById("result");
const convertBtn = document.getElementById("convertBtn");
const swapBtn = document.getElementById("swapBtn");

swapBtn.addEventListener("click", async () => {
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;

    const amount = parseAmount(amountInput.value);
    if (!amount) return;

    const result = await convertCurrency(amount, fromSelect.value, toSelect.value);
    showResult(resultText, result, toSelect.value);
});

// INIT
async function init() {
    const data = await getCodes();
    populateSelect(fromSelect, data.supported_codes);
    populateSelect(toSelect, data.supported_codes);

    fromSelect.value = "USD";
    toSelect.value = "DOP";

    // Inicializar la tabla de tasas populares
    await initializePopularRatesTable();
}

init();

// EVENT
convertBtn.addEventListener("click", async () => {
    const amount = parseAmount(amountInput.value);
    const from = fromSelect.value;
    const to = toSelect.value;

    if (!amount) return alert("Enter a valid amount");

    const result = await convertCurrency(amount, from, to);
    showResult(resultText, result, to);
});