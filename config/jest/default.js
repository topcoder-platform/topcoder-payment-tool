const config = require('topcoder-react-utils/config/jest/default');

config.transformIgnorePatterns[0] = '/node_modules/(?!appirio-tech|topcoder|tc-|@topcoder-platform)';

module.exports = config;
