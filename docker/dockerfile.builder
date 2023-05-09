FROM node:17.1.0 

LABEL \
  org.opencontainers.image.authors="Dillon Carns & Alex Feiszli, Gravitl, inc." \
  org.opencontainers.image.vendor="ReactJS" \
  org.opencontainers.image.url="local" \
  org.opencontainers.image.source="https://dockerhub.com/" \
  org.opencontainers.image.version="$VERSION" \
  org.opencontainers.image.revision="$REVISION" \
  vendor="ReactJS" \
  name="Netmaker" \
  version="$VERSION-$REVISION" \
  summary="The frontend of Netmaker. Netmaker builds fast, secure virtual networks." \
  description="This image contains the Netmaker frontend running with the ReactJS runtime. 2021 - Gravitl, inc."

RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package*.json ./
RUN npm install --silent
RUN npm install react-scripts@4.0.3 -g --silent