install:
	yarn install
	cd e2e && make install

dev_api:
	cd api && make dev

dev_web:
	cd web && make dev

start_api:
	cd api && make start

start_web:
	cd web && make start

start:
	yarn $@

dev:
	yarn $@

.PHONY: e2e
e2e:
	cd e2e && make test

deploy: install e2e
	cd api && make $@
	cd web && make $@
