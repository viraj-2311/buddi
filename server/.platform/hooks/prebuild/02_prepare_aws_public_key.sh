#!/usr/bin/env bash
set -x
echo "Loading environmental variables"
source /opt/elasticbeanstalk/deployment/env
echo "Copying public key from ec2-user"
mkdir -p /home/webapp/.ssh/
ssh_pub_key_path=/home/webapp/.ssh/ssh_pub_key
ssh_pub_key_pem_path=/home/webapp/.ssh/ssh_pub_pem_key.pem
echo "Extracting SSH_PublicKey from /home/ec2-user/.ssh/authorized_keys to ${ssh_pub_key_path}"
cat /home/ec2-user/.ssh/authorized_keys| head -n 1 > ${ssh_pub_key_path}

echo "Changing owner of ${ssh_pub_key_path} to be root"
chown root:root ${ssh_pub_key_path}
chmod 400 ${ssh_pub_key_path}

echo "Converting SSH_PublicKey to PEM format, tartget_path: ${ssh_pub_key_pem_path}"
ssh-keygen -f ${ssh_pub_key_path} -e -m pem >> ${ssh_pub_key_pem_path}

echo "Converting SSH_PublicKey to RSA_PublicKey, tartget_path: ${EC2_RSA_PUBLIC_KEY}"
openssl rsa -in ${ssh_pub_key_pem_path} -pubin -RSAPublicKey_in -out ${EC2_RSA_PUBLIC_KEY}
echo "Changing owner of ${EC2_RSA_PUBLIC_KEY} to be webapp"
chown webapp:webapp ${EC2_RSA_PUBLIC_KEY}
chmod 400 ${EC2_RSA_PUBLIC_KEY}
