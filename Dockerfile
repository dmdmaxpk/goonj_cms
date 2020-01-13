FROM node:alpine

# Node Environment
#ENV NODE_ENV development

# Create app directory
WORKDIR /opt/app

# Copy package.json & package-local.json
COPY package*.json ./

# Installing packages
RUN npm install

# Copy all the files
COPY . .

# Exposing the port, its 4000 for production in config file.
EXPOSE 4000

# Start process
CMD npm start
