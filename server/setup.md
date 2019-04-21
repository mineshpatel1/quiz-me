# Server Setup

```
# Uncomment line that allows all members of wheel to sudo without a passowrd
sudo visudo
sudo adduser chinnu
sudo usermod -a -G adm chinnu
sudo usermod -a -G wheel chinnu

sudo su chinnu
mkdir .ssh
chmod 700 .ssh

# Get public key from the .pem on your local machine
ssh-keygen -y -f quizme.pem

# Paste that into .ssh/authorized_keys on the remote server
touch .ssh/authorized_keys
chmod 600 .ssh/authorized_keys

# Install Node
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 10.15.3

# Install Python3
sudo yum install python3
curl -O https://bootstrap.pypa.io/get-pip.py
python3 get-pip.py --user

# Install Git and clone repo
sudo yum install git
cd /opt
sudo mkdir quiz-me
sudo chown chinnu:chinnu quiz-me
git clone https://github.com/mineshpatel1/quiz-me.git

cd quiz-me/server
npm install

# Set up keys/auth.json

{
    "pg": {
        "domain": "quizme",
        "db": "quizme",
        "port": 5432,
        "user": "pg user",
        "password": "pg password"
    },
    "session_secret": "some random string"
}

# Create tables in PostgreSQL
psql quizme < schema/tables.sql
```