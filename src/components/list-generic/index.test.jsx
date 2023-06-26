import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import testDbHelpers from 'src/utils/test-db-helpers';
import PropTypes from 'prop-types';
import ListGeneric from 'src/components/list-generic';

function TestComponent({
  data,
}) {
  return <div data-testid="test">{ data.name}</div>;
}
TestComponent.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

it('right number of items', () => {
  const list = testDbHelpers.oneListuser.results;

  render(
    <ListGeneric list={list} renderItem={TestComponent} />,
  );

  expect(screen.getAllByTestId('test')).toHaveLength(list.length);
});

it('right render of component passed in renderItem property with properties passed in list', () => {
  const item = testDbHelpers.listsUser.results[0];

  render(
    <ListGeneric list={[item]} renderItem={TestComponent} />,
  );

  expect(screen.getByText(item.name)).toBeInTheDocument();
});
