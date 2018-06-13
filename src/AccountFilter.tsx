import * as React from 'react'

interface IProps {
  selectOption: Array<{
    key: string | number,
    value: string | number,
  }>,
  onSelect: (parameter: any) => void
}

class AccountFilter extends React.Component<IProps, any> {
  public render() {
    const { selectOption } = this.props
    return (
      <div className="AccountFilter">
        <select
          className="AccountFilter__options"
          onChange={(this.handleOption)}
        >
          {selectOption.map(option => (
            <option
              key={option.key}
              value={option.value}
            >
              {option.key}
            </option>
          ))}
        </select>
      </div>
    )
  }

  private handleOption = ({ target }: any) =>
    this.props.onSelect(target.value)

}

export default AccountFilter
