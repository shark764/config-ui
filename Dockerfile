FROM docker.liveopslabs.com/nginx
MAINTAINER LiveOps Titan DI <titan@liveops.com>

COPY dist/ /var/www
COPY resources/wrapper.sh /opt/wrapper.sh

ENTRYPOINT ["./opt/wrapper.sh"]