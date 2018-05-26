import _ from 'lodash';

jest.mock('shared', () => ({
  default: 'APPLICATION',
}));

jest.mock('reducers', () => ({
  factory: () => () => ({}),
}));

jest.mock('topcoder-react-utils', () => {
  const TRU = require.requireActual('topcoder-react-utils');
  return {
    ...TRU,
    client: jest.fn(),
  };
});

test('Passes basic testing', () => {
  require('client');
  const { client } = require('topcoder-react-utils');

  const ops = client.mock.calls[0][0];
  expect(_.omit(ops, 'applicationModulePath')).toMatchSnapshot();

  expect(ops.applicationModulePath.endsWith('/src/shared/index.jsx'))
    .toBe(true);

  expect(ops.getApplication()).toMatchSnapshot();

  expect(ops.storeFactory()).toBeInstanceOf(Promise);
});
