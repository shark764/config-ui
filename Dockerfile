FROM ubuntu

# Update aptitude with new repo
RUN apt-get update

RUN apt-get install -y git
RUN apt-get install -y npm
RUN apt-get install -y nodejs
RUN apt-get install -y nginx

RUN ln -s /usr/bin/nodejs /usr/bin/node

ADD . /opt/liveops
RUN npm install --prefix /opt/liveops/ /opt/liveops/

CMD npm start /opt/liveops

EXPOSE 8000
