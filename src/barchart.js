const BarChart = async (year, color) => {
  // set the dimensions and margins of the graph
  const margin = window.innerWidth > 500 ? 100 : 50
  const width =
    window.innerWidth > 500 ? window.innerWidth / 2 - 2 * margin : window.innerWidth - 2 * margin
  const height = window.innerHeight / 2 - 2 * margin

  // set the ranges
  const x = d3.scaleTime().range([0, width])
  const y = d3.scaleLinear().range([height, 0])

  // append the svg object to the #graphs element of the page
  // append a 'group' element to 'svg'
  // move the 'group' element to the top left margin
  const svg = d3
    .select('#graphs')
    .append('svg')
    .attr('width', width + 1.9 * margin)
    .attr('height', height + 1.9 * margin)
    .append('g')
    .attr('transform', 'translate(' + margin + ',' + margin + ')')

  const parseTime = d3.timeParse('%Y-%m-%d')

  const fullData = await d3.csv('data.csv')
  const data = year ? fullData.filter(d => d.date.includes(year)) : fullData

  // format the data
  data.forEach(d => {
    d.date = parseTime(d.date)
    d.count = Number(d.count)
  })

  // Scale the range of the data in the domains
  x.domain(d3.extent(data, d => d.date))
  y.domain([0, 19000])
  //   y.domain([0, d3.max(data, d => d.count)])

  // append the rectangles for the bar chart
  svg
    .selectAll('.bar')
    .data(data, d => d.date)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('fill', color)
    .attr('x', d => x(d.date))
    .attr('width', width / data.length)
    .attr('y', d => y(d.count))
    .attr('height', d => height - y(d.count))

  // add the x Axis
  svg
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x))

  // add the y Axis
  svg.append('g').call(d3.axisLeft(y))

  // add title
  svg
    // .append('g')
    .append('text')
    .attr('x', width / 2)
    .attr('y', 0)
    .style('text-anchor', 'middle')
    .style('font-size', '3rem')
    .style('font-weight', 'bold')
    .text(year)
}
