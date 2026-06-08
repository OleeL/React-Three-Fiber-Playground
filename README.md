# React-Three-Fiber-Playground

Messing around with the React reconciler for three.js

## Static export

For local static testing from `http://localhost:3000/`, build without a base path:

```sh
npm run build
npm run serve:out
```

For GitHub Pages project-site output, build with the Pages base path and serve with clean URL rewrites:

```sh
GITHUB_PAGES_BASE_PATH=/React-Three-Fiber-Playground NEXT_PUBLIC_SITE_BASE_PATH=/React-Three-Fiber-Playground npm run build:pages
npm run serve:out:pages
```
