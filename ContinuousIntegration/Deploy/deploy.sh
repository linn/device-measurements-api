#!/bin/bash

CONFIGURATION=${1}
START_POPULATOR=${2}
TARGET_HOST=${3}
PACKAGE_NAME="cloud-exakt-services"

if [ ${CONFIGURATION} = "int" ]
then
	echo "Overriding TARGET_HOST"
    TARGET_HOST='apphost-int-linux'
    PACKAGE_NAME="cloud-exakt-services-int"
fi

echo "*************************************"
echo "*"
echo "* Configuration : ${CONFIGURATION}"
echo "* Target Host   : ${TARGET_HOST}"
echo "* Populator     : ${START_POPULATOR}"
echo "*"
echo "*************************************"

echo "update the service files"
ssh -oStrictHostKeyChecking=no linn-service@${TARGET_HOST} "sudo apt-get update"
ssh -oStrictHostKeyChecking=no linn-service@${TARGET_HOST} "sudo apt-get install ${PACKAGE_NAME}"  

if [ ${START_POPULATOR}  = "true" ]
then
	echo "Starting Cloud Exakt Populator"
	ssh -oStrictHostKeyChecking=no linn-service@${TARGET_HOST} "sudo /etc/init.d/cloud-exakt-populator start"
fi

echo "Starting Cloud Exakt Service"
ssh -oStrictHostKeyChecking=no linn-service@${TARGET_HOST} "sudo /etc/init.d/cloud-exakt-service start"