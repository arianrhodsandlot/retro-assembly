export const vendorsInfo = {
  name: 'retro-assembly-vendors',
  version: '1.17.0-20240225183742',
}

export const libretroDatabaseInfo = {
  name: 'libretro/libretro-database',
  version: '8bca7df',
}

export const fbneoInfo = {
  name: 'libretro/FBNeo',
  version: '4a555e0',
}

const cdnHosts = [
  'https://cdn.jsdelivr.net',
  'https://gcore.jsdelivr.net',
  'https://fastly.jsdelivr.net',
  'https://testingcf.jsdelivr.net',
  'https://www.jsdelivr.ren',
]

let [selectedCDNHost] = cdnHosts
async function testCDNPerformance() {
  const testFile = 'Nintendo - Nintendo Entertainment System.rdb'
  const path = `/gh/${libretroDatabaseInfo.name}@${libretroDatabaseInfo.version}/rdb/${encodeURIComponent(testFile)}`
  const controller = new AbortController()
  const init = { method: 'HEAD', signal: controller.signal }
  const requests = cdnHosts.map(async (host) => {
    const input = `${host}${path}`
    try {
      await fetch(input, init)
      selectedCDNHost = host
    } catch {}
    controller.abort()
  })

  await Promise.all(requests)
}

testCDNPerformance()

export function getCDNHost() {
  return selectedCDNHost
}
