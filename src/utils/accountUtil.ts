import { getTime, parse } from 'date-fns'
import { flow, filter, map, uniqBy } from 'lodash/fp'
import uuidv4 from 'uuid'

import { accountColoumType } from '../constants/accountConstants'
import { stringAmountToNumber, timeFormatter } from './formatter'

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
