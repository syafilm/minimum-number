import React, { Component } from 'react'

/*eslint-disable */
class Body extends Component {
  state = {
    amount: '',
    errorMessage: '',
    withComma: null,
    status: false,
  }

  handleAmountEnter = (e) => {
    if (e.key === 'Enter') {
      this.handleCurrencyValidation(e)
    }
  }

  handleAmount = (e) => {
    this.handleCurrencyValidation(e)
  }

  handleDelimiter = (value) => {
    const commaPattern = /,/g
    if (commaPattern.test(value)) {
      const commaLength = value.match(commaPattern).length
      const commaDelimiter = value.indexOf(',') + 1
      const zeroAfterComma = value.substr(commaDelimiter).length
      if (commaLength > 1
        || zeroAfterComma > 2
        || zeroAfterComma === 1
        || value.substr(commaDelimiter) !== '00') {
        return ({
          status: false,
          errorMessage: 'Invalid input separator',
        })
      }
    }
    return ({ status: true })
  }

  handleWhiteSpace = (value) => {
    const spacePattern = /\s/g
    if (spacePattern.test(value)) {
      const spaceLength = value.match(spacePattern).length
      const spaceDelimiter = value.indexOf(' ')
      if (spaceLength > 1 || spaceDelimiter !== 2) {
        return ({ status: false, errorMessage: 'Invalid input separator' })
      }
    }
    return ({ status: true })
  }

  handleSymbol = (value) => {
    const numberPattern = /^\d+$/
    const stringPattern = /^[A-Za-z\s]+$/
    let startValue = value.substr(0).trim()
      .split('.').join('')
      .split(',')
      .join('')
    let startPosition = value.indexOf('R')
    if (value.includes('Rp') && startPosition === 0) {
      startPosition = value.indexOf('p') + 1
      startValue = value.substr(startPosition).trim()
        .split('.').join('')
        .split(',')
        .join('')
      if (stringPattern.test(startValue)) {
        return ({ status: false, errorMessage: 'Invalid currency' })
      } if (!numberPattern.test(startValue)) {
        return ({ status: false, errorMessage: 'Missing value' })
      }
    } else if (value.includes('Rp') && startPosition !== 0) {
      return ({ status: false, errorMessage: 'Wrong position currency' })
    } else if (!value.includes('Rp') && (stringPattern.test(startValue)
    || startPosition !== 0)) {
      if (!numberPattern.test(startValue)) {
        return ({ status: false, errorMessage: 'Invalid currency' })
      }
    }
    return ({ status: true })
  }

  handleCurrencyValidation = (e) => {
    const { value } = e.target
    const delimiter = this.handleDelimiter(value.trim())
    const whiteSpace = this.handleWhiteSpace(value.trim())
    const symbol = this.handleSymbol(value.trim())
    if (value !== '' && parseInt(value) !== 0) {
      if (whiteSpace.status
        || symbol.status
        || delimiter.status) {
        this.setState({
          errorMessage: '',
          [e.target.name]: value,
          withComma: delimiter.status,
          status: true,
        })
      }
      this.setState({
        errorMessage: whiteSpace.errorMessage
        || symbol.errorMessage || delimiter.errorMessage,
        [e.target.name]: value,
        status: true,
      })
    } else {
      this.setState({
        status: false,
      })
    }
  }

  handleMinimumNumber = (amount, withComma) => {
    let calculate
    let total
    let calculateTotal
    let divider
    if (amount.includes('Rp')) {
      total = parseInt(amount.substr(2).split('.').join('').replace(/^,00+/g, ''), 10)
      divider = (total >= 100000 && 100000)
      || (total >= 10000 && 10000)
      || (total >= 1000 && 1000)
      || (total >= 100 && 100)
      || (total >= 10 && 10)
      || (total >= 1 && 1)
      if (total >= divider) {
        calculate = (total / divider).toString().split('')
        calculateTotal = (
          <div className="text-left commaplace">
            {calculate.filter(i => i !== '.').map((item, index) => (
              parseInt(item) !== 0 && (
                <span key={index}>
                  {parseInt(item) / parseInt(item)}
                  {' x '}
                  {'Rp'}{parseInt(item) * divider / Math.pow(10, index)}
                </span>
              )
            ))}
          </div>
        )
      }
    } else if (!amount.includes('Rp')) {
      total = withComma ? parseInt(amount.substr(0).split('.').join('').replace(/^,00+/g, ''), 10)
        : parseInt(amount.substr(0).split('.').join('').replace(/^,00+/g, ''), 10)
      divider = (total >= 100000 && 100000)
        || (total >= 10000 && 10000)
        || (total >= 1000 && 1000)
        || (total >= 100 && 100)
        || (total >= 10 && 10)
        || (total >= 1 && 1)
      if (total >= divider) {
        calculate = (total / divider).toString().split('')
        calculateTotal = (
          <div className="text-left commaplace">
            {calculate.filter(i => i !== '.').map((item, index) => (
              parseInt(item) !== 0 && (
                <span key={index}>
                  {parseInt(item) / parseInt(item)}
                  {' x '}
                  {parseInt(item) * divider / Math.pow(10, index)}
                </span>
              )
            ))}
          </div>
        )
      }
    }
    return calculateTotal
  }

  render() {
    const {
      errorMessage,
      amount,
      withComma,
      status,
    } = this.state

    return (
      <div className="container h-100">
        <div className="row h-100">
          <div className="col-12 d-flex align-items-center h-100 justify-content-center">
            <div className="d-block">
              <h3>Calculate the minimum number</h3>
              <input
                type="text"
                name="amount"
                onBlur={this.handleAmount}
                onKeyDown={this.handleAmountEnter}
                defaultValue={amount}
                className="form-control"
              />
              {status
              && (
                <div className="mb-1">
                  {errorMessage && (
                    <label className="text-danger d-block text-left">
                      {errorMessage}
                    </label>
                  )}
                  <div className="mt-2 d-flex">
                  {!errorMessage && (<span>Result :</span>)}  {!errorMessage && this.handleMinimumNumber(amount, withComma)}
                  </div>
                </div>
              )}
              <div>
                <span className="text-muted">
                  You can use enter to execute it or click outside of the form input
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Body
