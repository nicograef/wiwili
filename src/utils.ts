import { default as axios } from 'axios'

/**
 * Example: 'https://www.eco-visio.net/api/aladdin/1.0.0/pbl/publicwebpage/data/100004595?begin=20200101&end=20201218&step=4&domain=751&withNull=true&t=1dc232c11d5617076e9ae7add6e6140128067d38b986e7c9c9da41bb95c41a5b'
 * @param {number} lastDays Fetch data from the last n days
 */
function getDataUrl(lastNDays: number = 1) {
    const baseUrl = 'https://www.eco-visio.net/api/aladdin/1.0.0/pbl/publicwebpage/data/100004595?'
    const hardParams =
        '&step=4&domain=751&withNull=true&t=1dc232c11d5617076e9ae7add6e6140128067d38b986e7c9c9da41bb95c41a5b'

    const now = new Date()
    const today = dateToQueryParamDate(now)
    const timeDiffToStartDate = (24 * 60 * 60 * 1000) * lastNDays
    const startDayDate = new Date(now.getTime() - timeDiffToStartDate)
    const startDate = dateToQueryParamDate(startDayDate)
    const timeRangeParams = `begin=${startDate}&end=${today}`

    return baseUrl + timeRangeParams + hardParams
}

function dateToQueryParamDate(date: Date): string {
    return date.toISOString().split('T')[0].replace(/-/g, '')
}

interface IFetchDataOptions {
    /**
     * Fetch data from the last n days
     */
    lastNDays?: number;
}

/**
 * Fetch bike data in JSON format
 */
export async function fetchData(options: IFetchDataOptions) {
    const dataUrl = getDataUrl(options.lastNDays || 1)
    return axios.get(dataUrl).then((res) => res.data)
}