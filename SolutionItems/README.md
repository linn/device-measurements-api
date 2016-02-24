For deployment on a specific application host:

* Create an exakt user with group exakt
* Create folder /opt/linn writeable for exakt user/group
* Add AWS Credentials to the exakt user's home folder (~/.aws/credentials) readonly to exakt (0400):
* Append [jenkins-slave-linux-x64-it.id_rsa.pub] rsa public key to exakt user's home folder (~/.ssh/authorized_keys)
* Add sudoers entry [./exakt-cloud] into (/etc/sudoers.d/exakt-cloud) to allow exakt to install service scripts and restart them
* Run apt-key adv --fetch-keys http://apt-repo.linn.co.uk/keyring.gpg
* Add linn.list to /etc/apt/sources.list.d/

* On public servers (e.g. ec2) until we get something better in place, drop all traffic to port 60301 accept Linn:

iptables -A INPUT -p tcp --dport 60301 -s 195.59.102.251 -j ACCEPT
iptables -A INPUT -p tcp --dport 60301 -j DROP

