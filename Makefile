install:
	npm install

dev:
	npm run dev

dev_cloudflare:
	npm run pages:dev

build: clean
	npm run pages:build

start:
	npm run start

lint:
	npm run lint

lint_fix:
	npm run lint:fix

performance:
	npm run lighthouse

test: performance

ensure_cloudflare_kv_exists:
	chmod +x ./script/cloudflare/ensure-cloudflare-kv-exists.sh
	./script/cloudflare/ensure-cloudflare-kv-exists.sh "IMAGE_ANALYZER_KV"

ensure_cloudflare_page_exists:
	chmod +x ./script/cloudflare/ensure-cloudflare-pages-exists.sh
	./script/cloudflare/ensure-cloudflare-pages-exists.sh "image-analyzer-app"

ensure_cloudflare_secrets_exist:
	@$(call add_cloudflare_secret,"image-analyzer-app","NODE_VERSION",$(shell cat .node-version))	

ensure_cloudflare_infra_exists: ensure_cloudflare_page_exists ensure_cloudflare_kv_exists ensure_cloudflare_secrets_exist

deploy_cloudflare_page:
	npm run pages:deploy

deploy: install build ensure_cloudflare_infra_exists deploy_cloudflare_page

seed:
	node ./script/seed.js \
		--cloudflare-kv-binding-id "5df82e748f494385a2aeaf2912cbb359" \
		--seed-file "./data/seed.json"

clean:
	rm -rf .next/ .vercel/ build/

define add_cloudflare_secret
	chmod +x ./script/cloudflare/ensure-cloudflare-secret-exists.sh
	./script/cloudflare/ensure-cloudflare-secret-exists.sh "$(1)" "$(2)" "$(3)"
endef
