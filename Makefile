latest := $(shell date +'%Y-%m').json

install:
	npm install

action:
	mkdir -p ./api/v1
	HEADLESS=true  node runner.js
	mv ./kalender.temp.json ./api/v1/${latest}
	rm ./api/v1/kalender.json && ln -s ./api/v1/${latest} ./api/v1/kalender.json

develop:
	HEADLESS=false  node runner.js
