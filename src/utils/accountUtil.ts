import { getTime, parse, getMonth } from 'date-fns'
// import { keys } from 'lodash'
import { flow, filter, map, uniqBy, reduce, groupBy, fromPairs, keys } from 'lodash/fp'
import uuidv4 from 'uuid'

import { accountColoumType } from '../constants/accountConstants'
import { stringAmountToNumber, timeFormatter } from './formatter'

interface IAccountsInfo {
  expenseTotal?: number,
  expenseTotalByMonth?: number
}

const {
  BALANCE,
  CATEGORY,
  DATE,
  EXPENSE_BALANCE,
  INCOME_BALANCE
} = accountColoumType

const getTimeStamp = (date: string) => flow(
  parse,
  getTime
)(date)

export const createAccountDataObject = (accounts: string[][]) =>
  flow(
    filter((x: string[]) => x[DATE] !== ''),
    map((x: string[]) => ({
      id: uuidv4(),
      timeStamp: getTimeStamp(x[DATE]),
      incomeBalance: stringAmountToNumber(x[INCOME_BALANCE]),
      expenseBalance: stringAmountToNumber(x[EXPENSE_BALANCE]),
      restBalance: stringAmountToNumber(x[BALANCE]),
      category: x[CATEGORY],
    }))
  )(accounts)

export const getUniqueDateObject = (accounts: IAccount[]) => flow(
  map((x: IAccount) => x.timeStamp),
  uniqBy((x: number) => timeFormatter('YYYY-MM')(x)),
  map((x: number) => ({
    key: timeFormatter('YYYY-MM')(x),
    value: x,
  }))
)(accounts)

const getTotalAmount = reduce((sum, n: IAccount) => {
  if (n.expenseBalance && typeof n.expenseBalance === 'number' ) {
    return sum + n.expenseBalance
  }
  return sum
}, 0)

const getExpenseTotalByMonth = (accounts: IAccount[]): any => {
  const groupped = groupBy((account: IAccount) => getMonth(account.timeStamp) + 1)(accounts)
  return flow(
    keys,
    map((x: string) => [parseInt(x, 10), getTotalAmount(groupped[x])]),
    fromPairs
  )(groupped)
}

export const getAccountsInfoProvider = (accounts: IAccount[]): IAccountsInfo => {

  return accounts && {
    expenseTotal: getTotalAmount(accounts),
    expenseTotalByMonth: getExpenseTotalByMonth(accounts)
  }
}
