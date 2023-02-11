build:
	yarn $@

start: build
	yarn $@

dev:
	yarn $@

test:
	yarn $@

lint:
	yarn $@

fix:
	yarn lint:$@

deploy: lint build
	yarn wrangler pages publish ./dist --project-name "image-analyzer-web"

ship_it: lint test
	git push
