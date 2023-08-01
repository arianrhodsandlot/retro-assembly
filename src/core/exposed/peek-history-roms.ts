import { historyToRom, peekHistory } from '../helpers/history'

export async function peekHistoryRoms() {
  const history = await peekHistory()
  console.log(history)
  return historyToRom(history)
}
