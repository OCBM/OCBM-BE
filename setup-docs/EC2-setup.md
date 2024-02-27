# PRE-PROD-SETUP

## 1 - Setup node

To **install** or **update** nvm, you should run the [install script][2]. To do that, you may either download and run the script manually, or use the following cURL or Wget command:

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Running either of the above commands downloads a script and runs it. The script clones the nvm repository to `~/.nvm`, and attempts to add the source lines from the snippet below to the correct profile file (`~/.bash_profile`, `~/.zshrc`, `~/.profile`, or `~/.bashrc`).

<a id="profile_snippet"></a>

```sh
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

After installing `NVM` run the below following commands

```sh
# 
sudo apt-get update

# - Install node version 20
nvm install 20

# - Use node version 20
nvm use 20

# - check the node version
node -v
```

## 2 - Setup MQTT

```sh
# 1
sudo apt-get update

# 2
sudo apt-get install mosquitto
```

Setup password

```sh
sudo mosquitto_passwd -c /etc/mosquitto/password.txt flyers_omnex_sanmar_mqtt_user

# will prompt to enter password
```

Now we’ll open up a new configuration file for Mosquitto and tell it to use this password file to require logins for all connections:

```sh
# open the following file
sudo nano /etc/mosquitto/conf.d/default.conf

# past the following code
allow_anonymous false
password_file /etc/mosquitto/password.txt

# open the 
sudo nano /etc/mosquitto/mosquitto.conf
# past the following code
listener 1883
persistence true
persistence_location /etc/mosquitto/data/
log_dest file /etc/mosquitto/log/mosquitto.log
allow_anonymous false
password_file /etc/mosquitto/password.txt

# restart Mosquitto
sudo systemctl restart mosquitto
```

## 3 - Setup Nginx

- [how-to-install-nginx-on-ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04)

```sh
sudo apt update
sudo apt install nginx

# To check status
systemctl status nginx
# To restart
sudo systemctl restart nginx
```

Navigate to Config file

```sh
sudo nano /etc/nginx/nginx.conf
```

Paste the below code

```yaml
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {}

http {

  server {
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;

    # SSL Certificate
    ssl_certificate  /etc/nginx/certs/cert.pem;
    ssl_certificate_key /etc/nginx/certs/key.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH';
    ssl_session_cache shared:SSL:10m;

    # Increase file upload size (if needed)
    client_max_body_size 50M;

    # Proxy settings
    location /ocbm-be/ {
      proxy_pass http://localhost:4000/;
      proxy_http_version 1.1;
      proxy_set_header Host $host;

      # CORS headers if needed
      # Set CORS headers dynamically
      if ($http_origin ~* (http://localhost:5173|http://localhost:3000|http://47.129.22.222:9000|https:47.129.22.222|http:47.129.22.222|https://incomparable-parfait-2e9539.netlif>
        add_header 'Access-Control-Allow-Origin' $http_origin;
      }
      add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE, PATCH';
      add_header 'Access-Control-Allow-Headers' '*';
      add_header 'Access-Control-Expose-Headers' 'Content-Type, Content-Disposition, Content-Length';
      add_header 'Access-Control-Max-Age' 1728000;

      # Handle preflight requests
      if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' $http_origin;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE, PATCH';
        add_header 'Access-Control-Allow-Headers' '*';
        add_header 'Access-Control-Expose-Headers' 'Content-Type, Content-Disposition, Content-Length';
        add_header 'Access-Control-Max-Age' 1728000;
        return 204;
      }
    }

    location /ocbm-be/socket.io {
      rewrite ^/ocbm-be/(.*) /$1 break;
      proxy_pass http://localhost:4000;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";

      # CORS headers if needed
      # Set CORS headers dynamically
      if ($http_origin ~* (http://localhost:5173|http://localhost:3000|https:47.129.22.222|http:47.129.22.222|https://incomparable-parfait-2e9539.netlify.app)) {
          add_header 'Access-Control-Allow-Origin' $http_origin;
      }
      add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE, PATCH';
      add_header 'Access-Control-Allow-Headers' '*';
      add_header 'Access-Control-Expose-Headers' 'Content-Type, Content-Disposition, Content-Length';
      add_header 'Access-Control-Max-Age' 1728000;

      # Handle preflight requests
      if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' $http_origin;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE, PATCH';
        add_header 'Access-Control-Allow-Headers' '*';
        add_header 'Access-Control-Expose-Headers' 'Content-Type, Content-Disposition, Content-Length';
        add_header 'Access-Control-Max-Age' 1728000;
        return 204;
      }
    }


    location /ocbm-iot/ {
      # rewrite ^/ocbm-iot/(.*) /$1 break;
      proxy_pass http://localhost:9000/;
      proxy_http_version 1.1;
      proxy_set_header Host $host;


      # CORS headers if needed
      # Set CORS headers dynamically
      if ($http_origin ~* (http://localhost:5173|http://localhost:3000|http://47.129.22.222:9000|https:47.129.22.222|http:47.129.22.222|https://incomparable-parfait-2e9539.netlif>
        # add_header 'Access-Control-Allow-Origin' $http_origin;
      }
      add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE, PATCH';
      add_header 'Access-Control-Allow-Headers' '*';
      add_header 'Access-Control-Expose-Headers' 'Content-Type, Content-Disposition, Content-Length';
      add_header 'Access-Control-Max-Age' 1728000;

      # Handle preflight requests
      if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' https://incomparable-parfait-2e9539.netlify.app;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE, PATCH';
        add_header 'Access-Control-Allow-Headers' '*';
        add_header 'Access-Control-Expose-Headers' 'Content-Type, Content-Disposition, Content-Length';
        add_header 'Access-Control-Max-Age' 1728000;
        return 204;
      }
    }
    location /ocbm-iot/socket.io {
      rewrite ^/ocbm-iot/(.*) /$1 break;
      proxy_pass http://localhost:9000;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";

      # CORS headers if needed
      # Set CORS headers dynamically
      # if ($http_origin ~* (http://localhost:5173|http://localhost:3000|https:47.129.22.222|http:47.129.22.222|https://incomparable-parfait-2e9539.netlify.app)) {
      #   add_header 'Access-Control-Allow-Origin' $http_origin;
      # }
      add_header 'Access-Control-Allow-Origin' https://incomparable-parfait-2e9539.netlify.app;
      add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE, PATCH';
      add_header 'Access-Control-Allow-Headers' '*';
      add_header 'Access-Control-Expose-Headers' 'Content-Type, Content-Disposition, Content-Length';
      add_header 'Access-Control-Max-Age' 1728000;

      # Handle preflight requests
      if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' https://incomparable-parfait-2e9539.netlify.app;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE, PATCH';
        add_header 'Access-Control-Allow-Headers' '*';
        add_header 'Access-Control-Expose-Headers' 'Content-Type, Content-Disposition, Content-Length';
        add_header 'Access-Control-Max-Age' 1728000;
        return 204;
      }
    }
  }
}
```

Then restart the Nginx server

```sh
# To restart
sudo systemctl restart nginx
```

## 4 - Setup PM2

- [Official doc](https://pm2.keymetrics.io/)
- [how-to-use-pm2-to-setup-a-node-js-production-environment](https://www.digitalocean.com/community/tutorials/how-to-use-pm2-to-setup-a-node-js-production-environment-on-an-ubuntu-vps)

```sh
sudo npm install pm2 -g
```

## 5 - Copy source code

```sh
# Remove external folder (if needed)
rm -r my_directory
```

```sh
scp -i OCBM-IOT-KEY-PAIR-3.pem -r /Users/surya/Documents/omnex/DEPLOY_LOBBY/OCBM-BE ubuntu@ec2-18-142-85-39.ap-southeast-1.compute.amazonaws.com:/home/ubuntu/applications/
```

## 6 - Install Dependencies

```sh
# step - 1
cd applications/OCBM-BE
# step - 2
npm install --lock-file-only
# step - 3
npx prisma migrate dev
# step - 4
npm run build
# step - 5
pm2 start dist/main.js --name "OCBM-BE"

# step - 5
cd applications/OCBM-IOT
# step - 6
yarn install --frozen-lockfile
# step - 7
yarn build
# step - 8
pm2 start dist/main.js --name "OCBM-IOT"

# you can also increase JS heap size
pm2 start dist/main.js --name "OCBM-IOT" --max-memory-restart 100M
```

## Intsalling Mosquitto MQTT

- https://mosquitto.org/download/
- https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-the-mosquitto-mqtt-messaging-broker-on-ubuntu-16-04

```sh
sudo apt-get install mosquitto
```

```sh
# check MQTT status
sudo systemctl status mosquitto
```

## Install ubuntu

```sh
https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04
```
- sudo apt-get install mosquitto
- sudo mosquitto_passwd -c /etc/mosquitto/config/password.txt flyers_omnex_iiot