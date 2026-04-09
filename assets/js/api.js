import { CONFIG } from "../../config/config.js";

export async function getCodes() {

    const response = await fetch(`${CONFIG.BASE_URL}/${CONFIG.API_KEY}/codes`);
    const data = await response.json();
    return data;
}

export async function getConversion(from, to) {
    const response = await fetch(`${CONFIG.BASE_URL}/${CONFIG.API_KEY}/pair/${from}/${to}`);
    const data = await response.json();
    return data;
}

export async function getLatest(currency) {
    const response = await fetch(`${CONFIG.BASE_URL}/${CONFIG.API_KEY}/latest/${currency}`);
    const data = await response.json();
    return data;
}