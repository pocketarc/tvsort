FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /tvsort

# Install npm dependencies
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm ci

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /tvsort

ENV NODE_ENV production

# Copy node_modules (for sharp), and necessary files.
COPY --from=deps /tvsort/node_modules ./node_modules
COPY ./public ./public
COPY ./knexfile.ts ./knexfile.ts
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./src ./src
COPY ./migrations ./migrations
COPY ./.env ./.env
COPY ./tsconfig.json ./tsconfig.json

WORKDIR /tvsort
CMD ["npm", "run", "jobs-prod"]
