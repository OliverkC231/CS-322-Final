// for the budget slider (reference was ticketmaster's slider)
noUiSlider.create(budgetSlider, {
    start: [2000, 8000],
    connect: true,
    range: {'min': 0,'max': 10000}
});

budgetSlider.noUiSlider.on('update', function (values) {
    budgetValue.textContent = `$${Math.round(values[0])} - $${Math.round(values[1])}`;
});

