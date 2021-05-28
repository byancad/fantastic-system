# Step one
FROM node:16 AS builder

WORKDIR /app

COPY ./package.json ./

RUN yarn

COPY . .

RUN yarn build


# Step two 
FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD ["yarn", "start:prod"]
