import React from 'react';
import 'src/components/list-movie-grid/styles.css';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';

export default function DroppableItem({
  index, item, dragItemStyle = {}, children,
}) {
  return (
    <Draggable index={index} draggableId={item.key}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            // default item style
            padding: '8px 16px',
            // default drag style
            ...provided.draggableProps.style,
            // customized drag style
            ...(snapshot.isDragging ? dragItemStyle : {}),
          }}
        >
          {children(item, index)}
        </div>
      )}
    </Draggable>
  );
}
DroppableItem.propTypes = {
  index: PropTypes.number.isRequired,
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    photo: PropTypes.string,
    release_date: PropTypes.string,
    idTMDB: PropTypes.string.isRequired,
    rateAverage: PropTypes.number.isRequired,
    key: PropTypes.string.isRequired,
  }).isRequired,
  children: PropTypes.func.isRequired,
  dragItemStyle: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ),
};

DroppableItem.defaultProps = {
  dragItemStyle: {},
};
