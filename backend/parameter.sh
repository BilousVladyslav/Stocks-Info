#!/bin/sh
# shellcheck disable=SC2155,SC1090

echo "Import env started"

export SUPERUSER_EMAIL=`aws ssm get-parameters --profile vladyslav --name SUPERUSER_EMAIL --query Parameters[].Value`
export SUPERUSER_PASSWORD=`aws ssm get-parameters --profile vladyslav --name SUPERUSER_PASSWORD --with-decryption --query Parameters[].Value`
export SUPERUSER_USERNAME=`aws ssm get-parameters --profile vladyslav --name SUPERUSER_USERNAME --with-decryption --query Parameters[].Value`

export EMAIL_HOST=`aws ssm get-parameters --profile vladyslav --name EMAIL_HOST --query Parameters[].Value`
export EMAIL_PORT=`aws ssm get-parameters --profile vladyslav --name EMAIL_PORT --query Parameters[].Value`
export DEFAULT_FROM_EMAIL=`aws ssm get-parameters --profile vladyslav --name DEFAULT_FROM_EMAIL --with-decryption --query Parameters[].Value`
export EMAIL_HOST_USER=`aws ssm get-parameters --profile vladyslav --name EMAIL_HOST_USER --with-decryption --query Parameters[].Value`
export EMAIL_HOST_PASSWORD=`aws ssm get-parameters --profile vladyslav --name EMAIL_HOST_PASSWORD --with-decryption --query Parameters[].Value`
export EMAIL_USE_TLS=`aws ssm get-parameters --profile vladyslav --name EMAIL_USE_TLS --query Parameters[].Value`

#export MICROSERVICE_API_KEY_HEADER=`aws ssm get-parameters --profile vladyslav --name MICROSERVICE_API_KEY_HEADER --query Parameters[].Value`
#export MICROSERVICE_HOST=`aws ssm get-parameters  --profile vladyslav --name MICROSERVICE_REST_HOST --query Parameters[].Value`
#export MICROSERVICE_API_KEY=`aws ssm get-parameters  --profile vladyslav --name MICROSERVICE_REST_API_KEY --with-decryption --query Parameters[].Value`

echo "Done"
