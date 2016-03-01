FROM node:5.6.0
RUN apt-get update
RUN apt-get install -y libprotobuf-dev
ADD . /app
WORKDIR /app
ENV DEBUG *
ENV TZ US/Eastern
RUN npm install 
CMD node index.js
