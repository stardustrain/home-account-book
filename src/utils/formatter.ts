import { format } from 'date-fns'
import numeral from 'numeral'

export const stringAmountToNumber = (amount: string) => {
  return amount ? parseInt(amount.replace(',', ''), 10) : ''
}

export const timeFormatter = (pattern?: string) => {
  return (date: number) => format(date, pattern || 'YYYY-MM-DD')
}

export const numberAmountToFormatedString = (amount?: number | string) =>
  amount ? numeral(amount).format('0,0') : ''
