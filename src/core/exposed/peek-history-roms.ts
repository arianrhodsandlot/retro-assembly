import { historyToRom, peekHistory } from '../helpers/history'

export async function peekHistoryRoms() {
  const history = await peekHistory()
  return historyToRom(history)
}
