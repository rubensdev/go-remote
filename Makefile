listenAddr ?= :8000

.PHONY: help
help: # Show this help.
	@grep -E '^[a-zA-Z0-9 -]+:.*#'  Makefile | sort | while read -r l; do printf "\033[1;32m$$(echo $$l | cut -f 1 -d':')\033[00m:$$(echo $$l | cut -f 2- -d'#')\n"; done

.PHONY: build
build: # Minify the final CSS and build the app executable.
	@make js-build
	@make css-build
	@go build -tags prod -o bin/app .

.PHONY: dev
dev:
	make -j 3 css-watch js-watch air
	
.PHONY: air
air: # Live reloading (listenAddr=8000 by default)
	@LISTEN_ADDR=${listenAddr} air

.PHONY: js-build
js-build: # Build the final app.js minified
	@npx esbuild assets/js/app.js --bundle --outdir=static/js

.PHONY: js-watch
js-watch: # Watch app.js for changes
	@npx esbuild assets/js/app.js --bundle --outdir=static/js --watch=forever

.PHONY: css-build
css-build: # Minify the final CSS
	@npx tailwindcss -i assets/css/app.css -o static/css/app.css --minify

.PHONY: css-watch
css-watch: # Watch for CSS changes
	@npx tailwindcss -i assets/css/app.css -o static/css/app.css --watch