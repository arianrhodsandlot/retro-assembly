import { getHistory, historyToRom } from '../helpers/history'

export async function getHistoryRoms() {
  try {
    const history = await getHistory()
    return historyToRom(history)
  } catch {
    return []
  }
}
