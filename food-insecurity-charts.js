class FoodInsecurityCharts {
  constructor({ chartsContainer, demographicCategory, data, color }) {
    this.chartsContainer = chartsContainer;
    this.demographicCategory = demographicCategory;
    this.data = data;
    this.color = color;
    this.draw();
  }

  draw() {
    const demographicData = this.wrangleData(
      this.data,
      this.demographicCategory
    );

    const stackedAreaCharts = [];
    const stackedBarCharts = [];

    const chartContainer = this.chartsContainer
      .append("div")
      .attr("class", "charts-container")
      .selectAll(".chart-container")
      .data([...demographicData.keys()])
      .join("div")
      .attr("class", "chart-container mb-5 mx-2")
      .each((demographic, i, nodes) => {
        const selection = d3.select(nodes[i]);
        const chartTitle = selection
          .append("h2")
          .attr("class", "chart-title h6 mb-0")
          .text(`${this.demographicCategory} | ${demographic}`);

        const chartComponentsContainer = selection
          .append("div")
          .attr("class", "chart-components-container");

        const stackedAreaChartContainer = chartComponentsContainer
          .append("div")
          .attr("class", "stacked-area-chart");
        const stackedAreaChart = new FoodInsecurityStackedAreaChart({
          container: stackedAreaChartContainer,
          data: demographicData.get(demographic),
          color: this.color,
        });
        stackedAreaCharts.push(stackedAreaChart);

        const stackedBarChartContainer = chartComponentsContainer
          .append("div")
          .attr("class", "stacked-bar-chart");
        const stackedBarChart = new FoodInsecurityStackedBarChart({
          container: stackedBarChartContainer,
          data: demographicData.get(demographic),
          color: this.color,
        });
        stackedBarCharts.push(stackedBarChart);

        stackedAreaChartContainer.on("weekindexchange", (event) => {
          const weekIndex = event.detail;
          stackedAreaCharts.forEach((chart) =>
            chart.onWeekIndexChanged(weekIndex)
          );
          stackedBarCharts.forEach((chart) =>
            chart.onWeekIndexChanged(weekIndex)
          );
        });
      });
  }

  wrangleData(data, demographicCategory) {
    const filteredData = data.filter((d) => d[demographicCategory]);
    const grouped = d3.group(filteredData, (d) => d[demographicCategory]);
    return grouped;
  }
}
