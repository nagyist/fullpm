import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DropTarget } from 'react-dnd'

import Issue from 'components/Issue'
import 'styles/column'
import { calcColumnBodyHeight } from '../helpers/column'
import dropManager from 'helpers/dropManager'
import { spliceIssueInSync } from 'helpers/tickets'


const targetSpec = {
  drop({ id }) {
    return { containerId: id }
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

let intervalId

@connect(mapStateToProps)
@DropTarget('Issue', targetSpec, collect)
export default class Column extends Component {
  constructor() {
    super()
    this.state = { bodyMaxHeight: 0, forceUpdater: 0 }
  }

  componentWillMount() {
    intervalId = setInterval(() => {
      const { id, isOver, onSync } = this.props
      const { bodyMaxHeight, forceUpdater } = this.state

      // Restrict column contained in page without vertical scroll
      const newHeight = calcColumnBodyHeight(id)
      if (newHeight !== bodyMaxHeight) {
        this.setState({ bodyMaxHeight: newHeight })
      }

      if (isOver || onSync) this.setState({ forceUpdater: forceUpdater + 1 })
    }, 50)
  }

  componentWillUnMount() {
    clearInterval(intervalId)
  }

  render() {
    const { connectDropTarget, title, id, isOver, onSync } = this.props
    let { issues } = this.props
    const { bodyMaxHeight } = this.state
    const { draggingItem, isHoveringIssue } = dropManager

    const needClone = draggingItem && onSync
    const hasNewItemInSync = needClone && (id === dropManager.newCol)
    issues = spliceIssueInSync(hasNewItemInSync, issues, draggingItem)

    let count = issues.filter(d => !d.hide).length
    if (needClone) {
      const { col, newCol } = draggingItem
      const dropedToNewColumn = (col === id) && (newCol !== col)
      const dropedToSameColumn = newCol === col === id
      if (dropedToNewColumn || dropedToSameColumn) count -= 1
    }

    const appendToTail = isOver && (isHoveringIssue === false)

    return (
      <section className='column' id={`column${id}`}>
        <header className='header'>
          { title } <span className='count'>{ count }</span>
        </header>
        {
          connectDropTarget(
            <div className='body' style={{ height: bodyMaxHeight }} >
            {
              issues.map((d, i) => {
                if (draggingItem && onSync && (d._id === draggingItem.id)) {
                  return undefined
                }
                return (
                  <Issue
                    assignees={d.assignees}
                    col={id}
                    comments={d.comments}
                    hide={d.hide}
                    id={d.id}
                    key={i}
                    name={d.title || d.name}
                    number={d.number}
                    ranking={d.ranking}
                    url={d.htmlUrl || d.url}
                  />
                )
              })
            }
            {
              ((issues.length === 0 && isOver) || appendToTail) && (
                <Issue isPlaceHolder={true} />
              )
            }
            </div>
          )
        }
      </section>
    )
  }
}

function mapStateToProps(state) {
  return {
    onSync: state.issues.get('onSync')
  }
}
