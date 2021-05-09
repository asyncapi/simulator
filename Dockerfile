FROM node:14


WORKDIR ./



COPY .  ./app

RUN cd /app && npm install

EXPOSE 8084


CMD [ "node", "app/src/bin/dockerCli.js" ]


#UBUNTU IMAGE
#
#FROM ubuntu:18.04
#
#ENV NODE_VERSION 14.16.0
#
#RUN mkdir /app
#
#WORKDIR /app
#
#COPY . /app
#
#RUN apt update && apt upgrade -y && apt install -y curl  && apt install -y wget bash \
#    curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
#    apt install -y nodejs &&\
#    apt install -y npm
#
#
#RUN npm install
#
#
#ENV NODE_ENV development
#
#CMD ["node","scripts/ProgramManager/index.js"]
#
