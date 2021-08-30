YEAR_MONTH ?= $(shell date +'%Y_%m')
latest := ${YEAR_MONTH}.json

install:
	npm install

action:
	mkdir -p ./api/v1
	YEAR_MONTH=${YEAR_MONTH} HEADLESS=true  node runner.js
	mv ./kalender.temp.json ./api/v1/${latest}
	rm -f ./api/v1/kalender.json && ln -s ./api/v1/${latest} ./api/v1/kalender.json

develop:
	YEAR_MONTH=${YEAR_MONTH} HEADLESS=false  node runner.js
