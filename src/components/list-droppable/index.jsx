import React from 'react';
import 'src/components/list-movie-grid/styles.css';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import DroppableItem from 'src/components/droppable-item';

export default function ListDroppable({
  list, onDragEnd, dragListStyle = {}, ...props
}) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              ...(snapshot.isDraggingOver ? dragListStyle : {}),
            }}
          >
            {list.map((item, index) => (
              <DroppableItem
                key={item.key}
                index={index}
                item={item}
                {...props}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>

  );
}

ListDroppable.propTypes = {
  list: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  onDragEnd: PropTypes.func.isRequired,
  dragListStyle: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ),
};

ListDroppable.defaultProps = {
  dragListStyle: {},
};
