import * as d3 from 'd3'
import { colors } from './constants'

type ICountData = {
  year: string
  date: Date
  count: number
}

export function BarChart(data: ICountData[]) {
  // set the dimensions and margins of the graph
  const axisOffset = 50

  const svg = d3
    .select('svg')
    .append('g')
    .attr('transform', 'translate(' + axisOffset + ', ' + axisOffset + ')')

  const width = document.getElementsByTagName('svg')[0].clientWidth - 2 * axisOffset
  const height = document.getElementsByTagName('svg')[0].clientHeight - 2 * axisOffset

  const x = d3
    .scaleTime()
    .range([0, width])
    .domain(d3.extent(data.map(d => d.date)))
    // [data[0].date, data[data.length - 1].date])

  const y = d3
    .scaleLinear()
    .range([height, 0])
    .domain([0, 18000])
  // .domain([0, d3.max(data, d => d.count)])

  const countsPerYear = d3.groups(data, d => d.year)

  const legendSpace = width / countsPerYear.length

  countsPerYear.forEach(([year, d], i) => {
    const barWidth = width / 365 / countsPerYear.length
    const xOffset = barWidth * i

    // compute mean and title
    const counts = d.map((v) => v.count)
    const mean = Math.floor(d3.mean(counts)! / 100) * 100
    const title = year + ', ' + mean + '/Tag'

    svg
      .selectAll<SVGGElement, ICountData>('.bar')
      .data<ICountData>(d)
      .enter()
      .append('rect')
      .attr('fill', colors[year])
      .attr('x', d => x(d.date) + xOffset)
      .attr('width', barWidth)
      .attr('y', d => y(d.count))
      .attr('height', d => height - y(d.count))

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
