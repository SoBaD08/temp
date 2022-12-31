# Common build stage
FROM node:16.16.0-alpine3.16 as common-build-stage

COPY . ./app

WORKDIR /app

RUN npm install && npm run build

EXPOSE 3000

# Production build stage
FROM common-build-stage as production-build-stage

ENV NODE_ENV production

CMD ["npm", "run", "start"]