class FoodInsecurityStackedAreaChart {
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
      left: 40,
    };
    this.width = 320;
    this.height = 300;

    this.x = d3
      .scaleTime()
      .domain(d3.extent(this.weeks))
      .range([this.margin.left, this.width - this.margin.right]);
    this.y = d3
      .scaleLinear()
      .domain([0, 1])
      .range([this.height - this.margin.bottom, this.margin.top]);
    this.area = d3
      .area()
      .x((d, i) => this.x(this.weeks[i]))
      .y0((d) => this.y(d[0]))
      .y1((d) => this.y(d[1]));

    this.svg = this.container
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("viewBox", [0, 0, this.width, this.height])
      .on("mousemove", (event) => {
        this.moved(event);
      })
      .on("mouseleave", (event) => {
        this.left();
      });

    this.svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
      .call(d3.axisBottom(this.x).ticks(5).tickSizeOuter(0));

    this.svg
      .append("g")
      .attr("class", "y axis")
      .attr("transform", `translate(${this.margin.left},0)`)
      .call(d3.axisLeft(this.y).ticks(5, "%").tickSizeOuter(0))
      .call((g) => g.select(".domain").remove());

    this.svg
      .append("g")
      .attr("class", "areas")
      .selectAll(".area")
      .data(this.stackedData)
      .join("path")
      .attr("class", "area")
      .attr("fill", (d) => this.color(d.key))
      .attr("d", this.area);

    this.indicator = this.svg
      .append("line")
      .attr("class", "indicator__line")
      .attr("y1", this.margin.top - 6)
      .attr("y2", this.height - this.margin.bottom + 6)
      .attr("stroke", "currentColor");

    this.onWeekIndexChanged(this.weekIndex);
  }

  moved(event) {
    const [xm] = d3.pointer(event);
    const x = this.x.invert(xm);
    const weekIndex = d3.bisectCenter(this.weeks, x);
    if (weekIndex !== this.weekIndex) {
      this.container.dispatch("weekindexchange", {
        detail: weekIndex,
      });
    }
  }

  left() {
    const weekIndex = this.weeks.length - 1;
    if (weekIndex !== this.weekIndex) {
      this.container.dispatch("weekindexchange", {
        detail: weekIndex,
      });
    }
  }

  onWeekIndexChanged(weekIndex) {
    this.weekIndex = weekIndex;
    this.indicator.attr(
      "transform",
      `translate(${this.x(this.weeks[this.weekIndex])},0)`
    );
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
}
