FROM node:16
# Create app directory
WORKDIR /usr/src/last-fm-current-song

# Install pnpm to work with app
RUN npm install -g pnpm
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN pnpm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

CMD [ "node", "server.js" ]
