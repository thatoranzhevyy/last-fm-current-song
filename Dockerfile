FROM node:16

RUN mkdir -p /usr/src/last-fm-current-song
WORKDIR /usr/src/last-fm-current-song

RUN npm install -g pnpm
COPY package.json /usr/src/last-fm-current-song/

RUN pnpm install

COPY . /usr/src/app/

CMD [ "node", "main.js" ]
