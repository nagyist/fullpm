import React, { Component } from 'react'

import 'styles/app.scss'
import 'styles/Issue.scss'
import Main from './Main'
import Header from './Header'

export default class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Main />
      </div>
    )
  }
}
