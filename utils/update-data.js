const fs = require('fs')
const path = require('path')
const http = require('http')

const fetchData = () => {
  const today = new Date()
  const todayCode = `${today.getFullYear()}0${today.getMonth() + 1}${today.getDate()}`

  console.log('fetching new data ...')

  return new Promise((resolve, reject) => {
    const dataUrl = `http://www.eco-public.com/api/cw6Xk4jW4X4R/data/periode/100004595?begin=20120501&end=${todayCode}&step=4`

    http.get(dataUrl, (res) => {
      res.on('error', (error) => reject(error))

      res.setEncoding('utf8')

      let body = ''
      res.on('data', (data) => {
        body += data
      })

      res.on('end', () => {
        body = JSON.parse(body)
        resolve(body)
      })
    })
  })
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
