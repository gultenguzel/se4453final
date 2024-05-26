# Base image olarak resmi Node.js imajını kullan
FROM node:18.16.0-alpine

# SSH için gerekli paketleri yükle
RUN apt-get update && apt-get install -y openssh-server

# SSH server için gerekli yapılandırmayı yap
RUN mkdir /var/run/sshd
RUN echo 'root:Docker!' | chpasswd
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN sed -i 's/Port 22/Port 2222/' /etc/ssh/sshd_config

# Uygulama kodunu container'a kopyala
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# Uygulama portunu tanımla
EXPOSE 4000 2222

# SSH ve Node.js uygulamasını başlatmak için entrypoint script oluştur
CMD service ssh start && npm start
