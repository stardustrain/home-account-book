import * as React from 'react'

import AccountBook from './AccountBook'

class LivingCardPage extends React.Component {
  public render() {
    return (
      <AccountBook
        tab="2018_159721(2018)"
        chartId="living-account"
      />
    )
  }
}

export default LivingCardPage
