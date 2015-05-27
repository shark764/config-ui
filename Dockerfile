FROM nginx

RUN apt-get update
RUN apt-get install -y npm nodejs-legacy git

ADD . /opt/liveops

WORKDIR /opt/liveops

RUN npm install -g gulp bower
RUN npm install
RUN /usr/local/bin/bower install --allow-root
RUN ENV=test /usr/local/bin/gulp build

RUN rm -rf /usr/share/nginx/html
RUN cp -r dist /usr/share/nginx/html

EXPOSE 80
EXPOSE 443
