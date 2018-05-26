import React from 'react';
import Routes from 'routes';
import { JU } from 'topcoder-react-utils';

test('Matches shallow snapshot', () => {
  JU.shallowSnapshot(<Routes />);
});
