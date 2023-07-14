FROM node:16.3.0-alpine as build
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src
COPY @types ./
RUN ls -a
RUN npm install
COPY . .
RUN npm run prisma:generate
RUN npm run build


## this is stage two , where the app actually runs
FROM node:16.3.0-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --only=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/src ./src
RUN npm run prisma:generate
EXPOSE 3000
CMD ["node","dist/index.js"]