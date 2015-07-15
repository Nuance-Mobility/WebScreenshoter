FROM        nuancemobility/ubuntu-base:14.04

RUN         apt-get update -y && \
            apt-get install -y npm phantomjs && \
            ln -s /usr/bin/nodejs /usr/bin/node

ADD         src     /src

RUN         cd /src && npm install

EXPOSE      8080

ENTRYPOINT  [ "nodejs", "/src/index.js" ]
