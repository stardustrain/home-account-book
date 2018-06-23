import * as React from 'react'

import AccountBook from './AccountBook'

class CreditCardPage extends React.Component {
  public render() {
    return (
      <AccountBook
        tab="신용카드"
        chartId="credit-card"
      />
    )
  }
}

export default CreditCardPage
