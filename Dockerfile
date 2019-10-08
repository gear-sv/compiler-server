FROM node:10

RUN apt-get update
RUN apt-get install apt-utils -y 

# emscripten dependencies
RUN apt-get install python2.7 -y
RUN apt-get install cmake -y
RUN apt-get install default-jre -y 

# install emscripten
RUN apt-get install git-core -y 
RUN git clone https://github.com/emscripten-core/emscripten.git


