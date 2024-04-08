FROM node:18-alpine

WORKDIR /app

COPY . .
RUN npm i

ENV NEXT_PUBLIC_API_URL=

RUN npm run build

CMD ["npm", "run", "start"]
