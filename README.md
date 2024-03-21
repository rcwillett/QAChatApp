# QA Chat Server
---

## Introduction

This is the server side of a chat room application. It uses websocket communication to provide the chat functionality for the chat room. If a question is answered by another user, that question and answer is stored in a vector DB. These question and answer pairs are then queried using a cosine similarity to determine if a question has been answered. If there is a close enough match, that question's answer will be sent to the users in the chatroom.

## Running this App
In order to run this app you will need Git, Node.js V19.8.1 and npm V9.6.5 or up installed on your machine, a server running ElasticSearch DB V8.12.2, and an OpenAI Api Key with available usage.

After cloning this repo to your local machine, add a .env file with the following content:
```
CLIENT_ORIGIN="<Your client side origin domain"
PORT="<port of your choice>"
ELASTIC_SEARCH_ORIGIN="<Your elastic search domain>"
ELASTIC_SEARCH_USERNAME="<Your elastic search username>"
ELASTIC_SEARCH_PASSWORD="<Your elastic search password>"
OPENAI_API_KEY="<Your OpenAI api key>"
```

Once this is done you can run `npm install -d` and `npm run dev` to start the application in development mode.

## Technical Details
 This server uses socket.io to provide a websocket communication for the chat room, OpenAI's APIs ADA2 model to create word embeddings and ElasticSearch to serve as the Vector DB (which uses cosine simliarities to score matches)