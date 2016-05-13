import React from 'react'
import Sortable from 'sortablejs'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import 'normalize.css/normalize.css'
import 'styles/app.scss'
import 'styles/main.scss'
import Column from 'components/Column'
import { fetchIssues } from 'actions/ticketActions'
import { updateRepoSelected } from 'actions/repoActions'
import {
  ISSUE_TYPE_BACKLOG,
  ISSUE_TYPE_DOING,
  ISSUE_TYPE_DONE
} from 'helper/constant'

export class AppComponent extends React.Component {

  componentDidUpdate () {
    if (!this.refs.list) {
      return
    }
    Sortable.create(this.refs.list, {
      group: 'columns',
      ghostClass: 'columnGhost',
      handle: '.drag-handle',
      animation: 150
    })
  }

  enterRepo(url) {
    const { fetchIssues, updateRepoSelected } = this.props
    fetchIssues(url)
    updateRepoSelected(true)
  }

  render() {
    const {
      repos,
      repoSelected,
      sortedArr
    } = this.props

    return (
      <div className='AppComponent'>
        { repoSelected ? (
          <div>
            <button className='back-btn'>Back</button>
            <div ref='list' className='board-area'>
              {
                sortedArr.map((d, i) => {
                  return (
                    <Column key={i} id={d.id} title={d.name} issues={d.issues} />
                  )
                })
              }
            </div>
          </div>
        ) : (
          <div>
            {
              repos.map(d => (
                <button onClick={this.enterRepo.bind(this, d.get('url'))}>
                  {d.get('name')}
                </button>
              ))
            }
          </div>
        )}
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ fetchIssues, updateRepoSelected }, dispatch)
}

function parserTickets(tickets) {
  return [
    { id: 1, name: 'Backlog', issues: tickets.filter(d => d.column === ISSUE_TYPE_BACKLOG) },
    { id: 2, name: 'Doing', issues: tickets.filter(d => d.column === ISSUE_TYPE_DOING) },
    { id: 3, name: 'Done', issues: tickets.filter(d => d.column === ISSUE_TYPE_DONE) }
  ]
}

function mapStateToProps(state) {
  return {
    repos: state.repos.get('repos'),
    repoSelected: state.repos.get('repoSelected'),
    sortedArr: parserTickets(state.issues.get('tickets'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppComponent)
