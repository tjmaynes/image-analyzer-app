install:
	yarn $@

start:
	yarn $@

dev:
	yarn $@

test:
	yarn $@

lint:
	yarn $@

fix:
	yarn lint:$@

deploy: install lint
	yarn $@

ship_it: lint test
	git push
