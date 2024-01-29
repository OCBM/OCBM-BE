# CLOUD SETUP

## Connect with SSH

- Navigate to folder containing .pem
- Run `ssh -i [path-to-key.pem] ubuntu@[ip-address]`
  - example `ssh -i OCBM-IOT-KEY-PAIR-3.pem ubuntu@ec2-18-142-85-39.ap-southeast-1.compute.amazonaws.com`
- Start

### Install Docker

- Update the package index:

```bash
sudo apt update
```

- Install dependencies:

```bash
sudo apt install apt-transport-https ca-certificates curl software-properties-common
```

- Add Docker's GPG key:

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

- Add the Docker repository:

```bash
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

- Update the package index again:

```bash
sudo apt update
```

- Install Docker:

```bash
sudo apt install docker-ce docker-ce-cli containerd.io
```

- Add your user to the `docker` group to run Docker commands without sudo:

```bash
sudo usermod -aG docker $USER
# example
sudo usermod -aG docker ubuntu
```

- Logout by killing the session / terminal
- Verify that Docker is installed correctly:

```bash
docker --version
```

### Install Docker Compose

- Download the latest version of Docker Compose:

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

- Apply executable permissions to the binary:

```bash
sudo chmod +x /usr/local/bin/docker-compose
```

- Verify that Docker Compose is installed correctly:

```bash
docker-compose --version
```

### copy the source code

- Create `application` directory to copy source code

```bash
mkdir application
```

- Copy source code to VM through ssh

```bash
scp -i [path-to-key.pem] -r [path-containing-src-code] ubuntu@[ip-address]:/home/ubuntu/application/
# example
scp -i OCBM-IOT-KEY-PAIR-3.pem -r /Users/surya/Documents/omnex/trash/IOT ubuntu@ec2-18-142-85-39.ap-southeast-1.compute.amazonaws.com:/home/ubuntu/application/
```

### Run container

- start docker engine

```bash
sudo service docker start
```

- Build the images. (Navigate to the folder containing src code)

```bash
docker-compose -f docker-compose.prod.yml build
```

- Run the containers

```bash
docker-compose -f docker-compose.prod.yml up -d
```

- Bash into container

```bash
docker exec -it 33affbecb0c4 /bin/sh
```

`Run npm run prisma:migrate`

Stop and Remove All Containers:
Stop all running containers and remove them:

```bash
  docker stop $(docker ps -a -q)
  docker rm $(docker ps -a -q)
```

Remove All Images:
Remove all Docker images:

```bash
  docker rmi $(docker images -a -q)
```

Remove All Volumes:
Remove all Docker volumes:

```bash
  docker volume rm $(docker volume ls -q)
```

Uninstall Docker:
Now you can uninstall Docker using the package manager:

```bash
  sudo yum remove docker
```

Clean Up Remaining Docker Files (Optional):
After uninstalling Docker, you might want to clean up any remaining Docker files:

```bash
  sudo rm -rf /var/lib/docker
```
