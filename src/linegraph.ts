import * as d3 from 'd3'
import { colors } from './constants'

type countData = {
  year: string
  date: Date
  count: number
}

export function LineGraph(data: countData[]) {
  // set the dimensions and margins of the graph
  const axisOffset = 50

  const svg = d3
    .select('svg')
    .append('g')
    .attr('transform', 'translate(' + axisOffset + ', ' + axisOffset + ')')

  const width = document.getElementsByTagName('svg')[0].clientWidth - 2 * axisOffset
  const height = document.getElementsByTagName('svg')[0].clientHeight - 2 * axisOffset

  // set the ranges
  const x = d3
    .scaleTime()
    .range([0, width])
    .domain(d3.extent(data.map(d => d.date)))
  // [data[0].date, data[data.length - 1].date])

  const y = d3
    .scaleLinear()
    .rangeRound([height, 0])
    .domain([0, 18000])
  // .domain([0, d3.max(data, d => d.count)])

  const countLine = d3
    .line<countData>()
    .x(d => x(d.date))
    .y(d => y(d.count))
  // .curve(d3.curveCatmullRom)

  const countLines = d3.groups(data, d => d.year)

  const legendSpace = width / countLines.length // spacing for the legend

  countLines.forEach(([year, d], i) => {
    // compute mean and title
    const counts = d.map((v) => v.count)
    const mean = Math.floor(d3.mean(counts)! / 100) * 100
    const title = year + ', ' + mean + '/Tag'

    // add the line
    svg
      .append('path')
      .attr('class', 'line')
      .style('stroke', colors[year])
      .attr('d', countLine(d))

    // add title
    svg
      .append('text')
      .attr('class', 'legend')
      .attr('x', legendSpace / 2 + i * legendSpace)
      .attr('y', 0)
      .style('fill', colors[year])
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
