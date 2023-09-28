FROM nginx:latest

# COPY ./entrypoint-nginx.sh /

# RUN set -ex && \
# 	apk add --no-cache bash && \
# 	chmod +x /entrypoint-nginx.sh

COPY ./nginx.template /etc/nginx/conf.d/vhost.template

# COPY ../ /app/

# RUN nginx -t

CMD ["nginx", "-t"]