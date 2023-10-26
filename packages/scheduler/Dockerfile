FROM node:20 as build-deps

WORKDIR /usr/src/app

# Copy packages
COPY packages/utils ./packages/utils
COPY packages/scheduler ./packages/scheduler
COPY package.json yarn.lock ./

# Install all node packages across packages
RUN yarn install

# Build packages
RUN yarn workspace @vps/utils build
RUN yarn workspace @vps/scheduler build

# Remove dev dependencies
RUN yarn clean
RUN yarn install --production

FROM node:20-alpine

WORKDIR /app

# copy the build build image to base image
COPY --from=build-deps /usr/src/app/ .

RUN mkdir -p packages/scheduler/logs

CMD ["sh", "-c", "yarn workspace @vps/scheduler start"]
