import Application from 'shared';
import React from 'react';

const { JU } = require.requireActual('topcoder-react-utils');

let mockDevFrontendMode = false;

jest.mock('topcoder-react-utils', () => {
  const TRU = require.requireActual('topcoder-react-utils');
  return {
    ...TRU,
    isomorphy: {
      ...TRU.isomorphy,
      isDevBuild: () => mockDevFrontendMode,
    },
  };
});

test('Matches shallow snapshot', () => {
  JU.shallowSnapshot(<Application />);
});

test('Matches shallow snapshot in dev mode', () => {
  mockDevFrontendMode = true;
  JU.shallowSnapshot(<Application />);
});
