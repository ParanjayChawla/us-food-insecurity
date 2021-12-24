class FoodInsecurityStackedBarChart {
  constructor({ container, data, color }) {
    this.container = container;
    this.data = data;
    this.color = color;
    this.draw();
  }

  draw() {
    this.stackedData = this.wrangleData(this.data, this.color.domain());
    this.weeks = this.data.map((d) => d.weekStart);

    this.weekIndex = this.weeks.length - 1;

    this.margin = {
      top: 40,
      right: 10,
      bottom: 25,
      left: 10,
    };
    this.width = 60;
    this.height = 300;

    this.y = d3
      .scaleLinear()
      .domain([0, 1])
      .range([this.height - this.margin.bottom, this.margin.top]);

    this.svg = this.container
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("viewBox", [0, 0, this.width, this.height]);

    this.bars = this.svg.append("g").attr("class", "bars");

    this.barValues = this.svg
      .append("g")
      .attr("class", "bar-values")
      .attr("fill", "currentColor")
      .attr("text-anchor", "middle");

    this.yearLabel = this.svg
      .append("text")
      .attr("class", "year-label")
      .attr("fill", "currentColor")
      .attr("text-anchor", "middle")
      .attr("x", (this.margin.left + this.width - this.margin.right) / 2)
      .attr("y", this.margin.top - 28);

    this.weekLabel = this.svg
      .append("text")
      .attr("class", "week-label")
      .attr("fill", "currentColor")
      .attr("text-anchor", "middle")
      .attr("x", (this.margin.left + this.width - this.margin.right) / 2)
      .attr("y", this.margin.top - 12);

    this.onWeekIndexChanged(this.weekIndex);
  }

  onWeekIndexChanged(weekIndex) {
    this.weekIndex = weekIndex;

    const weekData = this.wrangleWeekData(this.stackedData, this.weekIndex);

    this.bars
      .selectAll(".bar")
      .data(weekData)
      .join("rect")
      .attr("class", "bar")
      .attr("fill", (d) => this.color(d.key))
      .attr("x", this.margin.left)
      .attr("width", this.width - this.margin.left - this.margin.right)
      .attr("y", (d) => this.y(d[1]))
      .attr("height", (d) => this.y(d[0]) - this.y(d[1]));

    this.barValues
      .selectAll(".bar-value")
      .data(weekData)
      .join("text")
      .attr("class", "bar-value")
      .attr("dy", "0.32em")
      .attr("x", (this.margin.left + this.width - this.margin.right) / 2)
      .attr("y", (d, i) => {
        let y = (this.y(d[0]) + this.y(d[1])) / 2;
        if (i === 0) {
          // The first series is always small, shift the text down so it doesn't overlap with the text above
          y += 6;
        }
        return y;
      })
      .text((d) => d3.format(".0%")(d.data.values[d.key]));

    this.yearLabel.text(weekData[0].data.year);
    this.weekLabel.text(weekData[0].data.week);
  }

  wrangleData(data, stackKeys) {
    const stack = d3
      .stack()
      .keys(stackKeys)
      .value((d, key) => d.values[key])
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);
    const stacked = stack(data);
    return stacked;
  }

  wrangleWeekData(stackedData, weekIndex) {
    const weekData = stackedData.map((d) => {
      const e = d[weekIndex];
      e.index = d.index;
      e.key = d.key;
      return e;
    });
    return weekData;
  }
}
