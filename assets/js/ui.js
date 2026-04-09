
export function populateSelect(select, codes) {
    codes.forEach(([code, name]) => {
        const option = document.createElement("option");
        option.value = code;
        option.textContent = `${code} - ${name}`;
        select.appendChild(option);
    });

}

export function showResult(resultElement, value, to) {
    resultElement.textContent = `${value.toFixed(2)} ${to}`;
}