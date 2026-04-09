import { getCodes } from "./api.js";
import { convertCurrency } from "../../services/exchangeService.js";
import { populateSelect, showResult } from "./ui.js";
import { parseAmount } from "./utils.js";

const amountInput = document.getElementById("amount");
const fromSelect = document.getElementById("fromCurrency");
const toSelect = document.getElementById("toCurrency");
const resultText = document.getElementById("result");
const convertBtn = document.getElementById("convertBtn");

// INIT
async function init() {
    const data = await getCodes();
    populateSelect(fromSelect, data.supported_codes);
    populateSelect(toSelect, data.supported_codes);

    fromSelect.value = "USD";
    toSelect.value = "DOP";
}

init();

// EVENT
convertBtn.addEventListener("click", async () => {
    const amount = parseAmount(amountInput.value);
    const from = fromSelect.value;
    const to = toSelect.value;

    if (!amount) return alert("Enter a valid amount");

    const result = await convertCurrency(amount, from, to);
    showResult(resultText, result);
});