import * as React from 'react'
import ReactPaginate from 'react-paginate'
import { chunk, isEqual } from 'lodash'

import {
  numberAmountToFormatedString,
  timeFormatter
} from './utils/formatter'

import './AccountsTable.css'

interface IProps {
  accounts: IAccount[],
}

interface IState {
  pageCount: number,
  selectedPageNumber: number,
  chunkedPage: IAccount[][],
}

const PAGE_LIMIT = 20

const headers = [
  '시간',
  '수입',
  '지출',
  '잔액',
  '항목',
]

const defaultTimeFormatter = timeFormatter()

class AccountsTable extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    const chunkedPage = this.getChunkedAccounts(props.accounts)

    this.state = {
      chunkedPage,
      pageCount: chunkedPage.length,
      selectedPageNumber: 0,
    }
  }

  public componentDidUpdate(prevProps: IProps) {
    if (isEqual(this.props.accounts, prevProps.accounts)) { return }

    const chunkedPage = this.getChunkedAccounts(this.props.accounts)
    this.setState({
      chunkedPage,
      pageCount: chunkedPage.length,
    })
  }

  public getChunkedAccounts = (accounts: IAccount[]) => {
    return chunk(accounts, PAGE_LIMIT)
  }

  public render() {
    const { pageCount, chunkedPage, selectedPageNumber } = this.state
    const currentPage = chunkedPage[selectedPageNumber]

    return (
      <React.Fragment>
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
            {currentPage && currentPage.map(account => (
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
        <ReactPaginate
          previousLabel="이전"
          nextLabel="다음"
          containerClassName="AccountsTable__pagination"
          pageClassName="AccountsTable__page"
          activeClassName="AccountsTable__page--active"
          previousClassName="AccountsTable__prev"
          nextClassName="AccountsTable__next"
          disabledClassName="AccountsTable__page--disabled"
          pageCount={pageCount}
          onPageChange={this.handlePageSelect}
        />
      </React.Fragment>
    )
  }

  private handlePageSelect = ({ selected }: { [selected: string]: number }) => {
    this.setState({
      selectedPageNumber: selected,
    })
  }
}

export default AccountsTable
