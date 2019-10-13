FROM node:lts

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
RUN cd emsdk \ 
    ./emsdk update && \ 
    ./emsdk install latest && \
    ./emsdk activate latest 

# add emsdk utils to bin
ENV PATH="/emsdk:/emsdk/fastcomp/emscripten:/emsdk/node/12.9.1_64bit/bin:$PATH" 

# add express server
COPY server/ /server/

# install server
RUN cd /server && \
    npm install

WORKDIR /server

ENTRYPOINT ["/usr/local/bin/npm","run","start"]
