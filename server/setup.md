# Server Setup

## User Accounts

Uncomment line that allows all members of wheel to sudo without a password.

```bash
sudo visudo
sudo adduser chinnu
sudo usermod -a -G adm chinnu
sudo usermod -a -G wheel chinnu

sudo su chinnu
cd $HOME
mkdir .ssh
chmod 700 .ssh

# Get public key from the .pem on your local machine
ssh-keygen -y -f quizme.pem

# Paste that into .ssh/authorized_keys on the remote server
touch .ssh/authorized_keys
chmod 600 .ssh/authorized_keys
```

##  Install Node

```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 10.15.3
nvm install node --reinstall-packages-from=node  # Update to latest
```

##  Install Python3

```bash
sudo yum install python3
curl -O https://bootstrap.pypa.io/get-pip.py
python3 get-pip.py --user
```

## Install Git and clone repo

```bash
sudo yum install git
cd /opt
sudo mkdir quiz-me
sudo chown chinnu:chinnu quiz-me
git clone https://github.com/mineshpatel1/quiz-me.git

cd quiz-me/server
npm install
```

## Set up `.config/config.json`

```json
{
    "aws": {
        "access_key": "aws_access_key",
        "access_secret": "aws_secret_access_key",
        "region": "eu-west-1",
        "email": "source_email@domain.com"
    },
    "server": {
        "host": "10.0.2.2",  // Android Development Loopback
        "port": 3000,
        "https": false
    },
    "pg": {
        "host": "quizme.region.rds",
        "db": "postgres",
        "port": 5432,
        "user": "quizme_admin",
        "password": "pg_password"
    },
    "session_secret": "random_string"
}
```

## Set up `.config/aws.json`

```json
{ 
  "accessKeyId": "aws_access_key", 
  "secretAccessKey": "aws_secret_access_key",
  "region": "eu-west-1"
}
```

## Create tables in PostgreSQL

Run SQL files in `schema` using a client, or using the command line:

```bash
psql quizme < schema/tables.sql
psql quizme < schema/functions.sql
```
