# Topcoder Payment Tool
![Master build status](https://img.shields.io/circleci/project/github/topcoder-platform/topcoder-payment-tool/master.svg)
![GitHub Release Downloads](https://img.shields.io/github/downloads/topcoder-platform/topcoder-payment-tool/total.svg)
![Release Version](https://img.shields.io/github/tag/topcoder-platform/topcoder-payment-tool.svg)

Based on
[`topcoder-react-starter`](https://github.com/topcoder-platform/topcoder-react-starter).

To install, test, and run in development mode:
```bash
$ npm install
$ npm test

# NODE_CONFIG_ENV can be "development" or "production". It has no influence on
# the code build and execution mode, it only sets the runtime configuration
# (Node Config).
$ NODE_CONFIG_ENV=development npm run dev
```

To install, test, and run in production mode:
```bash
$ npm install
$ npm test
$ npm run build

# Again, NODE_CONFIG_ENV can be "development" or "production" here.
$ NODE_CONFIG_ENV=production npm start
```
