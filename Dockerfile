FROM node:10

RUN apt-get update
RUN apt-get install apt-utils -y

# emscripten dependencies
RUN apt-get install python2.7 -y
RUN apt-get install cmake -y
RUN apt-get install default-jre -y

# install emscripten
RUN apt-get install git-core -y
WORKDIR /
RUN git clone https://github.com/emscripten-core/emsdk.git

# add express server
COPY server/ /server/

# install server
RUN cd /server && npm install

COPY ./run.sh /run.sh

ENTRYPOINT ["bin/bash", "run.sh"]
