import React, { Component } from 'react'
import { DragLayer } from 'react-dnd'

import Column from 'components/Column'
import Issue from 'components/Issue'
import dropManager from 'helpers/dropManager'


const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%'
}

function getItemStyles(props) {
  const { initialOffset, currentOffset } = props
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none'
    }
  }

  let { x, y } = currentOffset

  const transform = `translate(${x}px, ${y}px)`
  return {
    transform: transform,
    WebkitTransform: transform
  }
}

@DragLayer(monitor => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  initialOffset: monitor.getInitialSourceClientOffset(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging()
}))
export default class CustomDragLayer extends Component {
  render() {
    const { item: d, isDragging } = this.props

    if (!isDragging) return null

    return (
      <div style={layerStyles}>
        <div style={getItemStyles(this.props)}>
        {
          dropManager.isDraggingColumn ? (
            <Column
              className=''
              id={d.id}
              isCustom={true}
              issues={d.issues}
              tickets={d.tickets}
              title={d.title}
            />
          ) : (
            <Issue
              assignees={d.assignees}
              col={d.col}
              comments={d.comments}
              id={d.id}
              name={d.name}
              number={d.number}
              ranking={d.ranking}
              url={d.htmlUrl}
              className='grabbed'
            />
          )
        }
        </div>
      </div>
    )
  }
}
