ssh -o StrictHostKeyChecking=no ubuntu@$EC2_PUBLIC_IP_ADDRESS << 'ENDSSH'
  cd /home/ubuntu/benji-app
  export $(cat .env)
  /usr/local/bin/envsubst < docker/envs/.env.template.server  > docker/envs/.env.server
  /usr/local/bin/envsubst < docker/envs/.env.template.client  > docker/envs/.env.client
  sudo docker login -u $CI_REGISTRY_USER -p $CI_JOB_TOKEN $CI_REGISTRY
  sudo docker pull $IMAGE:client
  sudo docker pull $IMAGE:server
  sudo docker-compose -f docker-compose.yml stop client
  sudo docker-compose -f docker-compose.yml stop server
  sudo docker-compose -f docker-compose.yml up -d
  sudo docker system prune -f
ENDSSH
