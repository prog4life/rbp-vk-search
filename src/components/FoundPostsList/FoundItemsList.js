import React from 'react';
import pt from 'prop-types';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
// import FoundPostContainer from 'containers/FoundPostContainer';

function FoundItemsList({ itemIds, render }) {
  // TODO: No match with / Nothing found for "..." query

  if (!itemIds || itemIds.length === 0) {
    return (
      <ListGroup>
        <ListGroupItem style={{ textAlign: 'center' }}>
          {
            itemIds && itemIds.length === 0
              ? 'Nothing found'
              : 'No results yet' // itemIds === null
          }
        </ListGroupItem>
      </ListGroup>
    );
  }

  console.log('FOUND-ITEMS-LIST, itemIds: ', itemIds);

  return (
    <ListGroup>
      {
        itemIds.map((itemId, index) => (
          <ListGroupItem key={itemId}>
            {render(index + 1, itemId)}
            {/* <FoundPostContainer
              number={index + 1}
              postId={postId}
            /> */}
          </ListGroupItem>
        ))
      }
    </ListGroup>
  );
}

FoundItemsList.propTypes = {
  itemIds: pt.arrayOf(pt.number.isRequired),
};

FoundItemsList.defaultProps = {
  itemIds: null,
};

export default FoundItemsList;
