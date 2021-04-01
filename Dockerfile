FROM node:12.20.1 as builder

LABEL \
  org.opencontainers.image.authors="Alex Feiszli, Falconcat, inc." \
  org.opencontainers.image.vendor="ReactJS" \
  org.opencontainers.image.url="local" \
  org.opencontainers.image.source="https://dockerhub.com/" \
  org.opencontainers.image.version="$VERSION" \
  org.opencontainers.image.revision="$REVISION" \
  vendor="ReactJS" \
  name="Netmaker" \
  version="$VERSION-$REVISION" \
  summary="The frontend of Netmaker." \
  description="This image contains the Netmaker frontend running with the ReactJS runtime. 2021 - Falconcat, inc."

RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package*.json ./
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent
COPY . /usr/src/app
RUN npm run build

FROM nginx:1.14.1-alpine
# RUN rm -rf /etc/nginx/conf.d
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
COPY docker-entrypoint.sh generate_config_js.sh /
RUN chmod +x docker-entrypoint.sh generate_config_js.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
