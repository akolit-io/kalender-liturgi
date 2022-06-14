NEXT_YEARMONTH ?= $(shell date +'%Y-%m' -d '1 month')
THIS_YEARMONTH ?= $(shell date +'%Y-%m')

install:
	npm install -y
	npx playwright install chromium

action:
	mkdir -p ./api/v1
	YEARMONTH=${THIS_YEARMONTH} HEADLESS=true  node runner.js
	mv -f ./${THIS_YEARMONTH}.json ./api/v1/${THIS_YEARMONTH}.json
	rm -f ./api/v1/kalender.json && ln -P ./api/v1/${THIS_YEARMONTH}.json ./api/v1/kalender.json

	YEARMONTH=${NEXT_YEARMONTH} HEADLESS=true  node runner.js
	mv -f ./${NEXT_YEARMONTH}.json ./api/v1/${NEXT_YEARMONTH}.json

develop:
	YEARMONTH=${THIS_YEARMONTH} HEADLESS=true  node runner.js
