FROM 460140541257.dkr.ecr.us-east-1.amazonaws.com/nginx
MAINTAINER LiveOps Titan DI <titan@liveops.com>

COPY dist/ /var/www
COPY resources/wrapper.sh /opt/wrapper.sh

ENTRYPOINT ["./opt/wrapper.sh"]
