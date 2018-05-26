import Error404Page from 'components/Error404Page';
import React from 'react';
import { JU } from 'topcoder-react-utils';

test('Matches shallow snapshot', () => {
  JU.shallowSnapshot(<Error404Page />);
});
