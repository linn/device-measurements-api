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

define label_dockerfile
        @echo "" >> $(1)
        @echo "LABEL org.label-schema.vendor=\"Linn Products Ltd.\" \\" >> $(1)
        @echo "      org.label-schema.build-date=\"$(BUILD_DATE)\" \\" >> $(1)
        @echo "      org.label-schema.docker.dockerfile=\"/Dockerfile\" \\" >> $(1)
        @echo "      org.label-schema.version=\"$(TRAVIS_BUILD_NUMBER)\" \\" >> $(1)
        @echo "      org.label-schema.vcs-ref=\"$(VCS_REF)\" \\" >> $(1)
        @echo "      org.label-schema.vcs-type=\"Git\" \\" >> $(1)
        @echo "      org.label-schema.vcs-url=\"https://github.com/linn/device-measurements-api\" \\" >> $(1)
        @echo "      uk.co.linn.build-number=$(TRAVIS_BUILD_NUMBER) \\" >> $(1)
        @echo "      uk.co.linn.branch=$(TRAVIS_BRANCH) \\" >> $(1)
        @if [ "$(TRAVIS_BRANCH)" = "master" -a "$(TRAVIS_PULL_REQUEST)" = "false" ]; then \
                echo "      uk.co.linn.is-production=true" >> $(1); \
        else \
                echo "      uk.co.linn.is-production=false" >> $(1); \
        fi
endef

build:
	npm install

ping-resource:
	@echo "{ \"timeStamp\": \"$(TIMESTAMP)\", \"branch\": \"$(TRAVIS_BRANCH)\", \"build\": \"$(TRAVIS_BUILD_NUMBER)\", \"commit\": \"$(TRAVIS_COMMIT)\" }" > $(PINGJSON)

test: build
	NODE_ENV=test npm test

all-the-dockers: build ping-resource
	$(call label_dockerfile, Dockerfile)
	docker build -t $(DOCKER):$(TRAVIS_BUILD_NUMBER) .

docker-push:
	$(call tag_docker, $(DOCKER))
	docker push $(DOCKER)