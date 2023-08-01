import { getHistory, historyToRom } from '../helpers/history'

export async function getHistoryRoms() {
  const history = await getHistory()
  return historyToRom(history)
}
