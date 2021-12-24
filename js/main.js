d3.csv("US_Pulse_Data.csv").then((csv) => {
  const data = wrangleData(csv);

  const color = d3
    .scaleOrdinal()
    .domain([
      "Often not enough to eat",
      "Sometimes not enough to eat",
      "Enough Food, but not always the kinds wanted",
      "Enough of the kinds of food wanted",
      "Did not report",
    ])
    .range(["#cf597e", "#eeb479", "#39b185", "#009392", "#e9e29c"]);

  new SwatchLegend({
    legendWrapper: d3.select("#swatch-legend"),
    color,
  });

  const chartsContainer = d3.select("#charts-container");
  const demographicCategoryToggle = d3
    .select("#demographic-category-toggle")
    .selectAll("input")
    .on("change", (event) => {
      const demographicCategory = event.target.value;
      demographicCategoryChange(demographicCategory);
    });

  demographicCategoryChange("Age");

  function demographicCategoryChange(demographicCategory) {
    chartsContainer.selectAll("*").remove();
    new FoodInsecurityCharts({
      chartsContainer,
      demographicCategory,
      data,
      color,
    });
  }
});
