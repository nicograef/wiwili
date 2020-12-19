import * as d3 from 'd3'

import { LineGraph } from './linegraph'
import { BarChart } from './barchart'
import { colors } from './constants'

type countData = {
  year: string
  date: Date
  count: number
}

const parseTime = d3.timeParse('%m-%d')
const parseTimeWithYear = d3.timeParse('%Y-%m-%d')

d3.csv('data/counts-by-year.csv').then(rawData => {
  let selectedYears = ['2018', '2020']
  let selectedSmoothing = ['3-tage', '10-tage']
  let selectedChartType = 'bar-chart'
  let selectedChartMode = 'comparison'

  const updateGraph = () => {
    // Create new copy every time so we don't mess with the original data set
    const currentCopy: countData[] = rawData.map(d => ({
      year: d.year,
      date:
        selectedChartMode === 'comparison'
          ? parseTime(d.date)
          : parseTimeWithYear(d.year + '-' + d.date),
      count: Number(d.count)
    }))

    // smooth over the whole dataset so filtering does not affect smoothing.
    // problem: when year 2013 and year 2017 selected: smooth algorithm will calculat december 2013 into january 2017
    if (selectedSmoothing.includes('3-tage')) smooth(currentCopy, 2)
    if (selectedSmoothing.includes('10-tage')) smooth(currentCopy, 5)
    if (selectedSmoothing.includes('1-monat')) smooth(currentCopy, 15)
    if (selectedSmoothing.includes('3-monate')) smooth(currentCopy, 45)

    // Filter by years
    const filteredData = currentCopy.filter(d => selectedYears.includes(d.year))

    // Clear graph area
    document.querySelector('svg').innerHTML = ''

    // render selected chart
    if (selectedChartType === 'line-chart') LineGraph(filteredData)
    else if (selectedChartType === 'bar-chart') BarChart(filteredData)
  }

  const onYearsChange = (e: Event) => {
    const changedYear = e.target as HTMLInputElement
    if (changedYear.checked) selectedYears.push(changedYear.value)
    else selectedYears = selectedYears.filter(year => year !== changedYear.value)
    updateGraph()
  }

  const onSmoothingChange = (e: Event) => {
    const changedSmoothing = e.target as HTMLInputElement
    if (changedSmoothing.checked) selectedSmoothing.push(changedSmoothing.value)
    else
      selectedSmoothing = selectedSmoothing.filter(
        smoothing => smoothing !== changedSmoothing.value
      )
    updateGraph()
  }

  const onChartTypeChange = (e: Event) => {
    const clickedChartType = e.target as HTMLInputElement
    selectedChartType = clickedChartType.value
    updateGraph()
  }

  const onChartModeChange = (e: Event) => {
    const clickedChartMode = e.target as HTMLInputElement
    selectedChartMode = clickedChartMode.value
    updateGraph()
  }

  document.querySelectorAll('#years .checkbox').forEach((checkbox: HTMLSpanElement) => {
    const year = (checkbox.children[1] as HTMLInputElement).value
    checkbox.style.background = colors[year]
    checkbox.addEventListener('change', onYearsChange)
  })

  document
    .querySelectorAll('#smoothing .checkbox')
    .forEach(checkbox => checkbox.addEventListener('change', onSmoothingChange))

  document.querySelector('#chart-type').addEventListener('change', onChartTypeChange)
  document.querySelector('#chart-mode').addEventListener('change', onChartModeChange)

  updateGraph()
})

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
