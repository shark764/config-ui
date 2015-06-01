FROM docker.liveopslabs.com/nginx
MAINTAINER LiveOps Titan DI <titan@liveops.com>

COPY resources/default.conf /etc/nginx/conf.d/default.conf
COPY resources/wrapper.sh /opt/wrapper.sh

RUN rm -rf /usr/share/nginx/html/
COPY dist/ /usr/share/nginx/html

ENTRYPOINT ["./opt/wrapper.sh"]