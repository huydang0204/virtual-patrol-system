FROM node:20 as build-deps

WORKDIR /usr/src/app

# Copy packages
COPY packages/utils ./packages/utils
COPY packages/main-backend ./packages/main-backend
COPY package.json yarn.lock ./

# Install all node packages across packages
RUN yarn install

# Build packages
RUN yarn workspace @vps/utils build
RUN yarn workspace @vps/main-backend build

# Remove dev dependencies
RUN yarn clean
RUN yarn install --production

FROM node:20

WORKDIR /app

# copy the build build image to base image
COPY --from=build-deps /usr/src/app/ .

RUN mkdir -p packages/main-backend/logs
RUN mkdir -p packages/main-backend/uploads

CMD ["sh", "-c", "yarn workspace @vps/main-backend start"]
