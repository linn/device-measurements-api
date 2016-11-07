DOCKER := linn/device-measurements-api
DOCKER_BRANCH_TAG := $(shell echo ${TRAVIS_BRANCH} | sed s/\#/_/g)
TIMESTAMP := $(shell date --utc +%FT%TZ)
PINGJSON := ping.json
BUILD_DATE :=`date -u +"%Y-%m-%dT%H:%M:%SZ"`
VCS_REF :=`git rev-parse --short HEAD`
DEV_ENV := ./.env

define tag_docker
	@if [ "$(TRAVIS_BRANCH)" != "master" ]; then \
		docker tag $(1):$(TRAVIS_BUILD_NUMBER) $(1):$(DOCKER_BRANCH_TAG); \
	fi
	@if [ "$(TRAVIS_BRANCH)" = "master" -a "$(TRAVIS_PULL_REQUEST)" = "false" ]; then \
		docker tag $(1):$(TRAVIS_BUILD_NUMBER) $(1):latest; \
	fi
	@if [ "$(TRAVIS_PULL_REQUEST)" != "false" ]; then \
		docker tag $(1):$(TRAVIS_BUILD_NUMBER) $(1):PR_$(TRAVIS_PULL_REQUEST); \
	fi
endef

build:
	npm install

ping-resource:
	@echo "{ \"timeStamp\": \"$(TIMESTAMP)\", \"branch\": \"$(TRAVIS_BRANCH)\", \"build\": \"$(TRAVIS_BUILD_NUMBER)\", \"commit\": \"$(TRAVIS_COMMIT)\" }" > $(PINGJSON)

test: build
	NODE_ENV=test npm test

all-the-dockers: build ping-resource
	docker build -t $(DOCKER):$(TRAVIS_BUILD_NUMBER) \
	--build-arg VCS_REF=$(VCS_REF) \
	--build-arg VERSION=$(TRAVIS_BUILD_NUMBER) \
	--build-arg BUILD_DATE=$(BUILD_DATE) \
	.

docker-push:
	$(call tag_docker, $(DOCKER))
	docker push $(DOCKER)