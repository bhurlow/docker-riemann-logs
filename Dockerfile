FROM node:5.6.0
RUN apt-get update
RUN apt-get install -y libprotobuf-dev
ADD . /app
WORKDIR /app
ENV DEBUG gazette:*
ENV TZ US/Eastern
RUN rm -rf node_modules
RUN npm install
CMD node index.js
