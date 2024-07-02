install:
	npm ci
	npx playwright install --with-deps

dev:
	npm run dev

test_e2e:
	npm run test:e2e

test_e2e_report:
	npm run test:e2e:report

test: test_e2e

build:
	npm run build

lint:
	npm run lint

format:
	npm run format

start:
	npm run start

ship_it: lint build test
	git push

seed:
	node ./scripts/data/seed.js --seed-file "./src/data/db.json"

ensure_cloudflare_page_exists:
	chmod +x ./scripts/cloudflare/ensure-cloudflare-pages-exists.sh
	./scripts/cloudflare/ensure-cloudflare-pages-exists.sh "image-analyzer-app"

deploy_cloudflare_page:
	chmod +x ./scripts/cloudflare/cloudflare-page-deploy.sh
	./scripts/cloudflare/cloudflare-page-deploy.sh "image-analyzer-app" "dist"

#deploy: install build test ensure_cloudflare_page_exists deploy_cloudflare_page
deploy: install build test ensure_cloudflare_page_exists