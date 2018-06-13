import * as React from 'react'

import {
  numberAmountToFormatedString,
  timeFormatter
} from './utils/formatter'

interface IProps {
  accounts: IAccount[],
}

const headers = [
  '시간',
  '수입',
  '지출',
  '잔액',
  '항목',
]

const defaultTimeFormatter = timeFormatter()

class AccountsTable extends React.Component<IProps, any> {
  public render() {
    return (
      <table className="AccountsTable">
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {this.props.accounts.map(account => (
            <tr key={account.id}>
              <td>{defaultTimeFormatter(account.timeStamp)}</td>
              <td>{numberAmountToFormatedString(account.incomeBalance)}</td>
              <td>{numberAmountToFormatedString(account.expenseBalance)}</td>
              <td>{numberAmountToFormatedString(account.restBalance)}</td>
              <td>{account.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}

export default AccountsTable
