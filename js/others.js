function showMore() {
    let divPlus = document.getElementById('divPlus');
    let titleSpanPlus = document.getElementById('titleSpanPlus');

    if (checkVisibility(divPlus)) {
        divPlus.style.display = "none";
        titleSpanPlus.textContent = "Voir plus";
    } else {
        divPlus.style.display = "flex";
        titleSpanPlus.textContent = "Voir moins";
    }
}

function checkVisibility(element) {
    if (!element) return false;
    return element.style.display !== "none";
}
