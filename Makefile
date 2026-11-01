.PHONY: install dev lint test check build ci

install: ## Install dependencies and git hooks
	npm ci

dev: ## Start the local dev server
	npm run dev

lint: ## Run ESLint
	npm run lint

test: ## Run unit tests
	npm test

check: ## Run Astro type checks
	npm run check

build: ## Build the production site
	npm run build

ci: lint test check build ## Run the full CI pipeline locally
