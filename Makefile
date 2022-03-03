YEAR ?= $(shell date +'%Y')
MONTH ?= $(shell date +'%m')
latest := ${YEAR}-${MONTH}.json

install:
	npm install -y
	npx playwright install chromium

action:
	mkdir -p ./api/v1
	YEAR=${YEAR} MONTH=${MONTH} HEADLESS=true  node runner.js
	mv ./kalender.temp.json ./api/v1/${latest}
	rm -f ./api/v1/kalender.json && ln -s ./api/v1/${latest} ./api/v1/kalender.json

develop:
	YEAR=${YEAR} MONTH=${MONTH} HEADLESS=false  node runner.js
