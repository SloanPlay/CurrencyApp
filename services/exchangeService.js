import { getConversion } from "../assets/js/api.js";

export async function convertCurrency(amount, from, to) {
    const data = await getConversion(from, to);
    const rate = data.conversion_rate;

    return amount * rate;
}