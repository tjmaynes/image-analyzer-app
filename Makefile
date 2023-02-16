install:
	yarn install
	cd e2e && make install

start_api:
	cd api && make start

start_web:
	cd web && make start

start:
	yarn $@

.PHONY: e2e
e2e:
	cd e2e && make test

deploy: install e2e
	cd api && make $@
	cd web && make $@
