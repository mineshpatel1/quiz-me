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

git config credential.helper store
git push
# Enter username
# Enter personal access token
```

## Install PSQL

```bash
sudo yum install postgresql
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
        "cert_path": "path/to/certificates"
    },
    "pg": {
        "host": "quizme.region.rds",
        "db": "postgres",
        "port": 5432,
        "user": "quizme_admin",
        "password": "pg_password"
    },
    "fcm": {
        "db_url": "https://app-id.firebaseio.com"
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

## Set up `.config/fcm.json`

Download the key file from Firebase [Service Accounts](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk). Move and rename it to `.config/fcm.json`. The wizard will also give you a database URL that you should put in `config.json`.

## Create tables in PostgreSQL

Run SQL files in `schema` using a client, or using the command line:

```bash
psql quizme < schema/tables.sql
psql quizme < schema/functions.sql
```

## Configure IP routing

Routes HTTPS web traffic directly 

```bash
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 443 -j REDIRECT --to-port 3000
```

### Deleting Routes

```bash
sudo iptables -t nat -v -L PREROUTING -n --line-number  # View routes
sudo iptables -t nat -D PREROUTING <line_number>        # Delete specific route
```


## Configure Let's Encrypt

Useful [guide](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/SSL-on-an-instance.html#letsencrypt) on configuring this for Amazon Linux.

And for configuring Let's Encrypt with [NodeJS](https://itnext.io/node-express-letsencrypt-generate-a-free-ssl-certificate-and-run-an-https-server-in-5-minutes-a730fbe528ca).

```bash
cd $HOME
sudo wget -r --no-parent -A 'epel-release-*.rpm' http://dl.fedoraproject.org/pub/epel/7/x86_64/Packages/e/
sudo rpm -Uvh dl.fedoraproject.org/pub/epel/7/x86_64/Packages/e/epel-release-*.rpm
sudo yum-config-manager --enable epel*
sudo yum repolist all

sudo yum install -y certbot

sudo certbot certonly --manual

# Follow instructions, enter e-maial address, make the key available publicly and get PEM files

# 1. Enter your domain.
# 2. Run the Node server on HTTP, make sure the port is externally available and place the 
#    security challenge in server/assets/cert.

sudo chown root:wheel -R /etc/letsencrypt/archive
sudo chmod 770 -R /etc/letsencrypt/archive
sudo chown root:wheel -R /etc/letsencrypt/live
sudo chmod 770 -R /etc/letsencrypt/live
```

# Server Management

```bash
cd /opt/quiz-me/server
pm2 start app.js
pm2 log
pm2 monit
pm2 stop app
```