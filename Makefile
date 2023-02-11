install:
	yarn install

deploy: install
	cd api && make $@
	cd web && make $@
