// @flow
import * as React from 'react'
import { from } from 'rxjs'
import { take } from 'rxjs/operators'
import { findIndex, isEmpty, filter } from 'lodash'
import { flow } from 'lodash/fp'
import { isSameMonth } from 'date-fns'

import { createAccountDataObject, getUniqueDateObject } from './utils/accountUtil'
import credential from './client_secret.json'

import AccountsTable from './AccountsTable'
import AccountFilter from './AccountFilter'

interface IState {
  accounts?: IAccount[],
  filterOption: number | string,
}

const { SHEET_ID } = credential

class AccountBook extends React.Component<any, IState> {
  public state = {
    accounts: [],
    filterOption: '',
  }

  public componentDidMount() {
    from(
      window.gapi.client.sheets.spreadsheets.values.get({
        range: '2018_159721(2018)!B3:F',
        spreadsheetId: SHEET_ID,
      })
    )
    .pipe(take(1))
    .subscribe(
      (response: any) => this.setState({
        accounts: flow(
          this.getRemovedEmptyValueAccounts,
          createAccountDataObject
        )(response.result.values)
      })
    )
  }

  public render() {
    const { accounts } = this.state

    const selectableDates = [
      { key: 'all', value: '' },
      ...getUniqueDateObject(accounts)
    ]

    return (
      <div className="AccountBook">
        <AccountFilter
          selectOption={selectableDates}
          onSelect={this.selectDate}
        />
        <AccountsTable accounts={this.getFilterdAccounts(accounts)} />
      </div>
    )
  }

  private getRemovedEmptyValueAccounts = (accounts: string[][]) => {
    const startEmptyIndex = findIndex(
      accounts, (account: string[]) => isEmpty(account)
    )
    return accounts.slice(0, startEmptyIndex)
  }

  private getFilterdAccounts = (accounts: IAccount[]) => {
    const { filterOption } = this.state
    if (!filterOption) { return accounts }

    return filter(accounts, (account: IAccount) =>
      isSameMonth(account.timeStamp, parseInt(filterOption, 10))
    )
  }

  private selectDate = (filterOption: string | number) => {
    this.setState({
      filterOption,
    })
  }
}

export default AccountBook
