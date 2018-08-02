FROM node:8.11.3

RUN mkdir /home/node/.npm-global
ENV PATH=/home/node/.npm-global/bin:$PATH
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

COPY . /home/node/app
RUN chown -R node /home/node/app

RUN npm i bower@1.8.4 -g

RUN usermod -u 106 node

USER node
WORKDIR /home/node/app

RUN npm install
