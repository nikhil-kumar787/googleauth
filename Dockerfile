FROM node:8  
# Create app directory  
WORKDIR /usr/src/app  
COPY package*.json ./  
# Install app dependencies  
RUN npm install  
COPY . .  
EXPOSE 3001  
CMD [ "npm", "start" ]  