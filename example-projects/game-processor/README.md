# Sample game server processor

This application is for testing purposes for the simulation library. It is game server backend which subscribes to topics from MQTT and saves the events to MongoDB.

# Quick start
To make it as easy as possible to run the application docker is used.
## Requirements
- [Docker](https://docs.docker.com/get-docker/) + [compose](https://docs.docker.com/compose/install/)
- (optional) Node, but only in case you want to run the application manually

## Running through docker compose
Docker compose makes it easy to run everything at once.
- Start everything `docker-compose up -d`
- Stop everything `docker-compose down`
- Made changes? Build all the files `docker-compose build`

## Running the application manually
You can also run the application locally instead of through docker compose. It does require a node environment to be installed locally though.
- Start all the services `docker-compose up -d --scale processor=0`
- Install application dependencies `npm i`
- Start the application `npm run start`


## Files
Just to give a quick overview of the files for the application
- [index.js](./index.js) the application code itself, for simplicity everything is kept in one file. 
- [config.js](./config.js) simple configuration file for the application
- [asyncapi.yaml](./asyncapi.yaml) contains the AsyncAPI document for the application, where [./AsyncAPI/components](./AsyncAPI/components) contains the separate components.
- [Dockerfile](./Dockerfile) to build a docker image for the application
- [docker-compose.yaml](./docker-compose.yaml) combines all relevant services and the application together.
