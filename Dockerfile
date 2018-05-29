# Builds production version of the tool inside Docker container,
# and runs it against the specified Topcoder backend (development or
# production) when container is executed.

FROM node:8.11.2
LABEL app="Topcoder Payment Tool" version="1.0"

WORKDIR /opt/app
COPY . .

ARG NODE_CONFIG_ENV

ENV NODE_CONFIG_ENV=$NODE_CONFIG_ENV

RUN npm install
RUN npm test
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
