function wrangleData(csv) {
  /**
   * 0 'Enough of the kinds of food wanted',
   * 1 'Enough Food, but not always the kinds wanted',
   * 2 'Sometimes not enough to eat',
   * 3 'Often not enough to eat',
   * 4 'Did not report',
   * 5 'Age',
   * 6 'Sex_At_Birth',
   * 7 'Race',
   * 8 'Education',
   * 9 'Marital_Status',
   * 10 'Children_Present',
   * 11 'Location',
   * 12 'Week',
   * 13 'week_name',
   * 14 'Year'
   */
  const foodInsecurityLevels = csv.columns.slice(0, 5);
  const demographicCategories = csv.columns.slice(5, 11);

  const hasDemographicValue = (d) => d !== "NA";
  const weekStart = (d) =>
    d3.timeParse("%B %-d %Y")(`${d.week_name.split(" - ")[0]} ${d.Year}`);
  const weekLabel = (d) => {
    const [weekStart, weekEnd] = d.week_name.split(" - ");
    let [weekStartMonth, weekStartDate] = weekStart.split(" ");
    weekStartMonth = weekStartMonth.slice(0, 3); // Use a short month name
    let [weekEndMonth, weekEndDate] = weekEnd.split(" ");
    weekEndMonth = weekEndMonth.slice(0, 3); // Use a short month name
    return `${weekStartMonth} ${weekStartDate}-${weekEndMonth} ${weekEndDate}`;
  };

  const data = [];

  csv.forEach((d) => {
    const demographicCategory = demographicCategories.find((category) =>
      hasDemographicValue(d[category])
    );
    if (demographicCategory) {
      const values = foodInsecurityLevels.reduce((values, level) => {
        values[level] = +d[level];
        return values;
      }, {});
      // Convert raw counts to percentages
      const total = d3.sum(Object.values(values));
      Object.keys(values).forEach((key) => (values[key] = values[key] / total));
      data.push({
        values,
        [demographicCategory]: d[demographicCategory],
        weekStart: weekStart(d),
        week: weekLabel(d),
        year: d.Year,
      });
    }
  });

  return data;
}
