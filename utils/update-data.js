const fs = require('fs')
const path = require('path')
const axios = require('axios').default

/**
 * Example: 'https://www.eco-visio.net/api/aladdin/1.0.0/pbl/publicwebpage/data/100004595?begin=20200101&end=20201218&step=4&domain=751&withNull=true&t=1dc232c11d5617076e9ae7add6e6140128067d38b986e7c9c9da41bb95c41a5b'
 */
function getDataUrl() {
  const baseUrl = 'https://www.eco-visio.net/api/aladdin/1.0.0/pbl/publicwebpage/data/100004595?'
  const hardParams =
    '&step=4&domain=751&withNull=true&t=1dc232c11d5617076e9ae7add6e6140128067d38b986e7c9c9da41bb95c41a5b'

  const now = new Date()
  const today = now.toISOString().split('T')[0].replace(/-/g, '')
  const timeRangeParams = `begin=20120501&end=${today}`

  return baseUrl + timeRangeParams + hardParams
}

async function fetchData() {
  const dataUrl = getDataUrl()
  console.log(dataUrl)

  console.log('fetching new data ...')

  return axios.get(dataUrl).then((res) => res.data)
}

fetchData().then((data) => {
  const countsByYear = data.map((row) => {
    const [year, month, day] = row.date.split(' ')[0].split('-')
    const count = row.comptage
    return [year, month + '-' + day, count]
  })

  let output = 'year,date,count'
  countsByYear.forEach((row) => {
    output += '\n' + row.join(',')
  })

  fs.writeFileSync(path.join(__dirname, '../public/data/counts-by-year.csv'), output)

  console.log('updated data!')
})
