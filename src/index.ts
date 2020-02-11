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

d3.csv('data/counts-by-year.csv').then(rawData => {
  let selectedYears = ['2013', '2017', '2018']
  let selectedSmoothing = ['3-tage', '10-tage']
  let selectedChartType = 'bar-chart'

  const fullData: countData[] = rawData.map(d => ({
    year: d.year,
    date: parseTime(d.date),
    count: Number(d.count)
  }))

  const updateGraph = () => {
    // Filter by years
    const filteredData: countData[] = fullData
      .filter(d => selectedYears.includes(d.year))
      .map(d => ({
        year: d.year,
        date: d.date,
        count: d.count
      }))

    if (selectedSmoothing.includes('3-tage')) smooth(filteredData, 2)
    if (selectedSmoothing.includes('10-tage')) smooth(filteredData, 5)
    if (selectedSmoothing.includes('1-monat')) smooth(filteredData, 15)

    document.querySelector('svg').innerHTML = ''

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

  document.querySelectorAll('#years .checkbox').forEach((checkbox: HTMLSpanElement) => {
    const year = (checkbox.children[1] as HTMLInputElement).value
    checkbox.style.background = colors[year]
    checkbox.addEventListener('change', onYearsChange)
  })

  document
    .querySelectorAll('#smoothing .checkbox')
    .forEach(checkbox => checkbox.addEventListener('change', onSmoothingChange))

  document.querySelector('#chart-type').addEventListener('change', onChartTypeChange)

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
