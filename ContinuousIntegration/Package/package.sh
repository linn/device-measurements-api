#!/bin/bash

SYSROOT=deb-src/sysroot
TARGET_DIR=${SYSROOT}/opt/linn/exakt-cloud
DEBIAN=deb-src/DEBIAN

CONFIGURATION=${1}
BRANCH=${2}
BUILD_NUMBER=${3}
PRODUCTION_RELEASE=${4}

GIT_COMMIT=`git ls-remote git@it:/home/git/exakt-cloud.git ${BRANCH} | cut -f 1`
TIMESTAMP=`date --utc +%FT%TZ`
PACKAGE_NAME="cloud-exakt-services"
PACKAGE_VERSION="0.${BUILD_NUMBER}"
if [ ${PRODUCTION_RELEASE} = true ]
	then
	PACKAGE_VERSION="1.${BUILD_NUMBER}"
fi

echo "*************************************"
echo "*"
echo "* Configuration : ${CONFIGURATION}"
echo "* Branch        : ${BRANCH}"
echo "* Build Number  : ${BUILD_NUMBER}"
echo "* Git Commit    : ${GIT_COMMIT}"
echo "* Package Name  : ${PACKAGE_NAME}"
echo "* Package Ver   : ${PACKAGE_VERSION}"
echo "*"
echo "*************************************"

echo "Setup directories"
mkdir -p ${DEBIAN}
mkdir -p ${SYSROOT}
mkdir -p ${TARGET_DIR}
mkdir -p ${SYSROOT}/etc/init.d

# Get files for Deb file
echo "Packaging Template"
git archive --format=tar --remote=git@it:/home/git/exakt-cloud.git ${BRANCH} | tar --directory=${TARGET_DIR} -xf -

# Copy Environment
echo "Copying Environment"
mkdir -p ${TARGET_DIR}/CloudExaktPopulator/config
git archive --format=tar --remote=git@it:/home/git/exakt-cloud.git ${BRANCH}:CloudExaktPopulator/config ${CONFIGURATION}.js | tar --directory=${TARGET_DIR}/CloudExaktPopulator/config -xf -
mkdir -p ${TARGET_DIR}/CloudExaktService/config
git archive --format=tar --remote=git@it:/home/git/exakt-cloud.git ${BRANCH}:CloudExaktService/config ${CONFIGURATION}.js | tar --directory=${TARGET_DIR}/CloudExaktService/config -xf -

# Only copy ddl.js if deploying to int
if [ ${CONFIGURATION} = "int" ]
then
	echo "Copying Populator DDL library"
	mkdir -p ${TARGET_DIR}/CloudExaktPopulator/config/libs
	git archive --format=tar --remote=git@it:/home/git/exakt-cloud.git ${BRANCH}:CloudExaktPopulator/config/libs ddl.js | tar --directory=${TARGET_DIR}/CloudExaktPopulator/config/libs -xf -
	echo "Copying Service DDL library"
	mkdir -p ${TARGET_DIR}/CloudExaktService/config/libs
	git archive --format=tar --remote=git@it:/home/git/exakt-cloud.git ${BRANCH}:CloudExaktService/config/libs ddl.js | tar --directory=${TARGET_DIR}/CloudExaktService/config/libs -xf -
    PACKAGE_NAME="cloud-exakt-services-int"
fi

# Create ping resources
echo "Creating ping resources"
echo "{ \"timeStamp\": \"${TIMESTAMP}\", \"config\": \"${CONFIGURATION}\", \"branch\": \"${BRANCH}\", \"build\": \"${BUILD_NUMBER}\", \"commit\": \"${GIT_COMMIT}\" }" > ${TARGET_DIR}/CloudExaktPopulator/ping.json
echo "{ \"timeStamp\": \"${TIMESTAMP}\", \"config\": \"${CONFIGURATION}\", \"branch\": \"${BRANCH}\", \"build\": \"${BUILD_NUMBER}\", \"commit\": \"${GIT_COMMIT}\" }" > ${TARGET_DIR}/CloudExaktService/ping.json

echo "Copying Cloud Exakt Service Init Script"
git archive --format=tar --remote=git@it:/home/git/exakt-cloud.git ${BRANCH}:ContinuousIntegration/Deploy/startup-scripts cloud-exakt-service.${CONFIGURATION} | tar --directory=${SYSROOT}/etc/init.d/ -xf -
mv ${SYSROOT}/etc/init.d/cloud-exakt-service.${CONFIGURATION} ${SYSROOT}/etc/init.d/cloud-exakt-service
chmod +x ${SYSROOT}/etc/init.d/cloud-exakt-service

echo "Copying Cloud Exakt Populator Init Script"
git archive --format=tar --remote=git@it:/home/git/exakt-cloud.git ${BRANCH}:ContinuousIntegration/Deploy/startup-scripts cloud-exakt-populator.${CONFIGURATION} | tar --directory=${SYSROOT}/etc/init.d/ -xf -
mv ${SYSROOT}/etc/init.d/cloud-exakt-populator.${CONFIGURATION} ${SYSROOT}/etc/init.d/cloud-exakt-populator
chmod +x ${SYSROOT}/etc/init.d/cloud-exakt-populator

echo "Create preinst file"
echo "if [ -e /etc/init.d/cloud-exakt-service ]" > ${DEBIAN}/preinst
echo "then" >> ${DEBIAN}/preinst
echo "/etc/init.d/cloud-exakt-service stop" >> ${DEBIAN}/preinst
echo "fi" >> ${DEBIAN}/preinst
echo "if [ -e /etc/init.d/cloud-exakt-populator ]" >> ${DEBIAN}/preinst
echo "then" >> ${DEBIAN}/preinst
echo "/etc/init.d/cloud-exakt-populator stop" >> ${DEBIAN}/preinst
echo "fi" >> ${DEBIAN}/preinst

echo "Copy preinst file to prerm to stop service when uninstalling"
cp ${DEBIAN}/preinst ${DEBIAN}/prerm

echo "Make control file"
echo "Package: ${PACKAGE_NAME}" > ${DEBIAN}/control
echo "Version: ${PACKAGE_VERSION}" >> ${DEBIAN}/control
echo "Section: base" >> ${DEBIAN}/control
echo "Priority: optional" >> ${DEBIAN}/control
echo "Architecture: amd64" >> ${DEBIAN}/control
INSTALLED_SIZE=`du -s ${SYSROOT}`
echo "Installed-Size: ${INSTALLED_SIZE}" >> ${DEBIAN}/control
echo "Depends: nodejs (>= 0.12)" >> ${DEBIAN}/control
echo "Maintainer: IT  <it.developers@linn.co.uk>" >> ${DEBIAN}/control
echo "Description: Cloud exakt service and populator service" >> ${DEBIAN}/control

echo "Creating deb package"
pushd deb-src/

pushd sysroot/
fakeroot -- tar czf ../data.tar.gz *
popd

pushd DEBIAN/
fakeroot -- tar czf ../control.tar.gz *
popd

echo 2.0 > debian-binary
fakeroot -- ar r ../cloud-exakt-${PACKAGE_VERSION}-${CONFIGURATION}.deb debian-binary control.tar.gz data.tar.gz
popd