FROM node:12.18.3

LABEL version="1.0"
LABEL description="This is the base docker image for the Kisan Mitra Bot backend API."
LABEL maintainer = ["Yashraj Desai"]

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]
RUN ls
RUN npm install --production
COPY . .

EXPOSE 3001

CMD ["node", "index.js"]
