import { factory } from 'reducers';

describe('Reducer created without HTTP request', () => {
  let reducer;

  beforeAll(async () => {
    reducer = await factory();
  });

  test('Creates expected initial state', () => {
    expect(reducer({}, {})).toMatchSnapshot();
  });
});


describe('Reducer created with HTTP request', async () => {
  let reducer;

  beforeAll(async () => {
    reducer = await factory({
      headers: {

      },
      hostname: 'test-website.com',
      protocol: 'http',
    });
  });

  test('Creates expected initial state', () => {
    expect(reducer).toMatchSnapshot();
  });
});
