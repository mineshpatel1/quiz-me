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

sudo yum install git
cd /opt
sudo mkdir quiz-me
sudo chown ec2-user:ec2-user quiz-me
git clone https://github.com/mineshpatel1/quiz-me.git

curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 10.15.3

sudo yum install python3
curl -O https://bootstrap.pypa.io/get-pip.py
python3 get-pip.py --user
```