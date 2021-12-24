class SwatchLegend {
  constructor({ legendWrapper, color }) {
    this.legendWrapper = legendWrapper;
    this.color = color;
    this.draw();
  }

  draw() {
    const swatch = this.legendWrapper
      .append("div")
      .attr("class", "swatches")
      .selectAll(".swatch")
      .data(this.color.domain())
      .join("div")
      .attr("class", "swatch");

    swatch
      .append("div")
      .attr("class", "swatch__swatch")
      .style("background-color", (d) => this.color(d));

    swatch
      .append("div")
      .attr("class", "swatch__text")
      .text((d) => d);
  }
}
