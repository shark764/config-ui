FROM nginx

RUN apt-get update
RUN apt-get install -y npm nodejs-legacy git

# For PhantomJS
RUN apt-get install -y libfontconfig

ADD . /opt/liveops

WORKDIR /opt/liveops

RUN npm install -g gulp bower
RUN npm install
RUN /usr/local/bin/bower install --allow-root
RUN ENV=test /usr/local/bin/gulp build
RUN /usr/local/bin/gulp coverage

RUN cp -r etc/* /etc/

RUN rm -rf /usr/share/nginx/html
RUN cp -r dist /usr/share/nginx/html
RUN cp -r coverage/PhantomJS\ 1.9.8\ \(Linux\) /usr/share/nginx/coverage

EXPOSE 80
EXPOSE 443
EXPOSE 8080
