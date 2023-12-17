install:
	npm install

dev:
	npm run dev

.PHONY: build
build:
	npm run build

start: build
	npm run start

lint:
	npm run lint

lint_fix:
	npm run lint:fix

performance:
	chmod +x ./script/$@.sh
	./script/$@.sh "3000"

test: lint build

deploy: install test
	npm run pages:deploy

clean:
	rm -rf node_modules/ .next/