FROM docker.liveopslabs.com/nginx
MAINTAINER LiveOps Titan DI <titan@liveops.com>

RUN mkdir -p /opt/liveops/conf
COPY resources/default.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /usr/share/nginx/html/
COPY dist/ /usr/share/nginx/html

VOLUME ["/opt/liveops/conf"]

CMD ["nginx", "-g", "daemon off;"]