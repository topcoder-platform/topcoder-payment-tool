/**
 * Root component of the app.
 */

import React from 'react';
import Routes from 'routes';

import { DevTools, MetaTags, isomorphy } from 'topcoder-react-utils';

import 'topcoder-react-ui-kit/dist/style.css';

import 'styles/global.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function Application() {
  return (
    <div>
      <MetaTags
        title="Topcoder React Starter"
        description="Yet another webapp based on Topcoder React Starter Kit"
      />
      <Routes />
      { isomorphy.isDevBuild() ? <DevTools /> : undefined }
    </div>
  );
}
