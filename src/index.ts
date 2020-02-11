import { LineGraph } from './linegraph'

// BarChart('2012', 'blue')
// BarChart('2013', 'green')
// BarChart('2014', 'red')
// BarChart('2015', 'black')
// BarChart('2016', 'blue')
// BarChart('2017', 'green')
// BarChart('2018', 'red')
// BarChart('2019', 'black')

// LineGraph(['2019'])
// LineGraph(['2013', '2016', '2019'])
// LineGraphFull()

let selectedYears = ['2013', '2018']
let selectedSmoothing = ['3-tage']
LineGraph(selectedYears, selectedSmoothing)

const onYearsChange = (e: Event) => {
  const changedYear = e.target as HTMLInputElement
  if (changedYear.checked) selectedYears.push(changedYear.value)
  else selectedYears = selectedYears.filter(year => year !== changedYear.value)

  document.querySelector('#graphs').innerHTML = ''

  LineGraph(selectedYears, selectedSmoothing)
}

const onSmoothingChange = (e: Event) => {
  const changedSmoothing = e.target as HTMLInputElement
  if (changedSmoothing.checked) selectedSmoothing.push(changedSmoothing.value)
  else
    selectedSmoothing = selectedSmoothing.filter(smoothing => smoothing !== changedSmoothing.value)

  document.querySelector('#graphs').innerHTML = ''

  LineGraph(selectedYears, selectedSmoothing)
}

document
  .querySelectorAll('#years .checkbox')
  .forEach(checkbox => checkbox.addEventListener('change', onYearsChange))

document
  .querySelectorAll('#smoothing .checkbox')
  .forEach(checkbox => checkbox.addEventListener('change', onSmoothingChange))
