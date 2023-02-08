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

logs:
	yarn $@

deploy: install lint test
	yarn $@

ship_it: lint test
	git push
