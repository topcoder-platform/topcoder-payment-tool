# Builds production version of Community App inside Docker container,
# and runs it against the specified Topcoder backend (development or
# production) when container is executed.

FROM node:8.11.2

WORKDIR /opt/app
COPY . .

ARG CDN_URL
ARG NODE_CONFIG_ENV
ARG SEGMENT_IO_API_KEY

ENV CDN_URL=$CDN_URL
ENV NODE_CONFIG_ENV=$NODE_CONFIG_ENV
ENV SEGMENT_IO_API_KEY=$SEGMENT_IO_API_KEY

RUN npm install
RUN npm install net
RUN npm install tls
RUN npm install @topcoder-platform/tc-auth-lib
RUN npm test
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
