build: node_modules index.js
	mkdir -p build
	browserify --require ./index.js:on-off --outfile build/build.js

node_modules: package.json
	npm install

lint:
	jshint index.js

clean:
	rm -fr build node_modules

.PHONY: clean lint build
