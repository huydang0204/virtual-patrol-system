FROM node:20-alpine AS build
WORKDIR /app

COPY packages/utils ./packages/utils
COPY packages/frontend ./packages/frontend
COPY package.json yarn.lock ./

# Install all node packages across packages
RUN yarn install

# Build packages
RUN yarn workspace @vps/utils build
RUN yarn workspace @vps/frontend build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html

RUN mkdir -p /usr/share/nginx/media
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=build /app/packages/frontend/dist .

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
