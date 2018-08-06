/**
 * The shared part of Topcoder Payment Tool. This code is further wrapped in
 * different ways by Wepback and ExpressJS server to properly support both
 * client- and server-side rendering.
 *
 * This very file is the entry point that ensures correct order of imported
 * external styles.
 */

/* eslint-disable global-require */
if (process.env.NODE_ENV === 'production') {
  require('topcoder-react-ui-kit/dist/prod/style.css');
} else {
  require('topcoder-react-ui-kit/dist/dev/style.css');
}
/* eslint-enable global-require */

require('styles/global.scss');
require('slick-carousel/slick/slick.css');
require('slick-carousel/slick/slick-theme.css');

const App = require('./App').default;

export default App;
