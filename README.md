# product-listing

A digital list of products with elegant querying support 🔍 ✨

## Prerequisite

- Node 14 or above
- NPM or Yarn package manager

## Local setup

- Open the terminal, navigate to the root directory of the project.
- Run `yarn` or `npm install` to install project dependencies.
- Then execute `yarn start`, open browser then navigate to http://localhost:1234

# Production setup

- Open the terminal, navigate to the root directory of the project.
- Run `yarn build` or `npm run build` to build.
- Install `http-server` by executing `yarn add http-server -g` or `npm i http-server -g`, notice this will install `http-server` into your local machine, can be remove by `npm uninstall http-server -g` or `yarn remove http-server -g`
- Then execute `http-server dist` (where `dist` is the output directory of the previous building process), then navigate to http://127.0.0.1:8080 (or follow the instruction)
