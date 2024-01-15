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

ensure_cloudflare_page_exists:
	chmod +x ./script/cloudflare/ensure-cloudflare-pages-exists.sh
	./script/cloudflare/ensure-cloudflare-pages-exists.sh "image-analyzer-app"

deploy_cloudflare_page:
	npm run pages:deploy

deploy: install build ensure_cloudflare_page_exists deploy_cloudflare_page

seed:
	node ./script/data/seed.js --seed-file "./src/data/seed.json"

clean:
	rm -rf .next/ .vercel/ build/

define add_cloudflare_secret
	chmod +x ./script/cloudflare/ensure-cloudflare-secret-exists.sh
	./script/cloudflare/ensure-cloudflare-secret-exists.sh "$(1)" "$(2)" "$(3)"
endef
