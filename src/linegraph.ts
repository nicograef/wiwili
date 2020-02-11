import * as d3 from 'd3'

type countData = {
  year: string
  date: Date
  count: number
}

export const LineGraph = async (years: string[], smoothing: string[]) => {
  // set the dimensions and margins of the graph
  const margin = 100
  const width = window.innerWidth - 2 * margin
  const height = window.innerHeight - 4 * margin

  // append the svg object to the #graphs of the page
  // append a 'group' element to 'svg'
  // move the 'group' element to the top left margin
  const svg = d3
    .select('#graphs')
    .append('svg')
    .attr('width', width + 1.9 * margin)
    .attr('height', height + 1.5 * margin)
    .append('g')
    .attr('transform', 'translate(' + margin + ',' + margin + ')')

  const parseTime = d3.timeParse('%m-%d')

  const fullData = await d3.csv('data/counts-by-year.csv')
  const rawData = years ? fullData.filter(d => years.includes(d.year)) : fullData

  // format the data
  const data: countData[] = rawData.map(d => ({
    year: d.year,
    date: parseTime(d.date),
    count: Number(d.count)
  }))

  // set the ranges
  const x = d3
    .scaleTime()
    .range([0, width])
    .domain(d3.extent(data, d => d.date))
  const y = d3
    .scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(data, d => d.count)])

  const countLine = d3
    .line<countData>()
    .x(d => x(d.date))
    .y(d => y(d.count))
  // .curve(d3.curveCatmullRom)

  const countLines = d3
    .nest<countData>()
    .key(d => d.year)
    .entries(data)

  const color = d3.scaleOrdinal(d3.schemeCategory10)

  const legendSpace = width / countLines.length // spacing for the legend

  countLines.forEach((d, i) => {
    if (smoothing.includes('3-tage')) smooth(d.values, 2)
    if (smoothing.includes('10-tage')) smooth(d.values, 5)
    if (smoothing.includes('1-monat')) smooth(d.values, 15)

    // compute mean and title
    const counts = d.values.map((v: countData) => v.count)
    const mean = Math.floor(d3.mean(counts) / 100) * 100
    const title = d.key + ', ' + mean + '/Tag'

    // add the line
    svg
      .append('path')
      .attr('class', 'line')
      .style('stroke', () => (d['color'] = color(d.key)))
      .attr('d', countLine(d.values))

    // add title
    svg
      .append('text')
      .attr('class', 'legend')
      .attr('x', legendSpace / 2 + i * legendSpace)
      .attr('y', 0)
      .style('fill', () => (d['color'] = color(d.key)))
      .text(title)
  })

  // add the x Axis
  svg
    .append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x))

  // add the y Axis
  svg
    .append('g')
    .attr('class', 'axis')
    .call(d3.axisLeft(y))
}

const smooth = (data, avgWidth) => {
  // smoothing with forward moving average
  data.forEach((d, i) => {
    let localAvgWidth = avgWidth
    if (i < avgWidth) localAvgWidth = i
    else if (i >= data.length - avgWidth) localAvgWidth = data.length - i - 1

    const localData = data.slice(i - localAvgWidth, i + localAvgWidth + 1)
    const localAverage = d3.mean(localData.map(d => d.count))

    d.count = localAverage
  })
}
