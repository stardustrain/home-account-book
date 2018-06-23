import * as React from 'react'
import { from } from 'rxjs'
import { take } from 'rxjs/operators'
import { findIndex, isEmpty, filter, values, keys } from 'lodash'
import { flow } from 'lodash/fp'
import { isSameMonth } from 'date-fns'

import {
  createAccountDataObject,
  getUniqueDateObject,
  getAccountsInfoProvider
} from './utils/accountUtil'
import { numberAmountToFormatedString } from './utils/formatter'
import { SHEET_RANGE } from './constants/apiConfig'
import credential from './client_secret.json'

import AccountsTable from './AccountsTable'
import AccountFilter from './AccountFilter'
import ChartView from './ChartView'
import Indicator from './Indicator'

interface IProps {
  tab: string,
  chartId: string,
}

interface IState {
  accounts?: IAccount[],
  filterOption: number | string,
  isLoading: boolean,
}

const { SHEET_ID } = credential

class AccountBook extends React.Component<IProps, IState> {
  public state = {
    accounts: [],
    filterOption: '',
    isLoading: false,
  }

  public componentDidMount() {
    this.setState({
      isLoading: true,
    })

    from(
      window.gapi.client.sheets.spreadsheets.values.get({
        range: `${this.props.tab}${SHEET_RANGE}`,
        spreadsheetId: SHEET_ID,
      })
    )
    .pipe(
      take(1)
    )
    .subscribe(
      (response: any) => this.setState({
        isLoading: false,
        accounts: flow(
          this.getRemovedEmptyValueAccounts,
          createAccountDataObject
        )(response.result.values)
      })
    )
  }

  public render() {
    const { accounts, isLoading } = this.state
    const selectableDates = [
      { key: 'all', value: '' },
      ...getUniqueDateObject(accounts),
    ]

    const {
      expenseTotalByMonth,
      expenseTotal
    } = getAccountsInfoProvider(accounts)

    return (
      <div className="AccountBook">
        {isLoading ? (<Indicator />) : (
          <React.Fragment>
            <AccountFilter
            selectOption={selectableDates}
            onSelect={this.selectDate}
            />
            <ChartView
              chartId={this.props.chartId}
              type="bar"
              labels={keys(expenseTotalByMonth)}
              datasets={[{
                label: `생활비 계좌 사용 내역: 총 ${numberAmountToFormatedString(expenseTotal)}원`,
                data: values(expenseTotalByMonth),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]}
            />
            <AccountsTable accounts={this.getFilterdAccounts(accounts)} />
          </React.Fragment>
        )}
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
