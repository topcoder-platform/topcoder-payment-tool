jest.mock('shared', () => 'APPLICATION');
jest.mock('reducers', () => ({ factory: jest.fn(() => () => ({})) }));
jest.mock('../../webpack.config', () => () => ({}));

jest.mock('topcoder-react-utils', () => {
  const TRU = require.requireActual('topcoder-react-utils');
  return {
    ...TRU,
    server: jest.fn(),
  };
});

test('Passes basic tests', () => {
  require('server');
  const { server } = require('topcoder-react-utils');
  expect(server.mock.calls).toHaveLength(1);
  expect(server.mock.calls[0]).toMatchSnapshot();
  const { beforeRender } = server.mock.calls[0][1];
  expect(() => beforeRender()).not.toThrow();
});
