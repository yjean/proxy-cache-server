# Proxy cache server

> Proxy ressources and write them on file server for next call. A migration-easier tool.

## Installation

First, install the server. Once you have downloaded the code, type: `npm install` and then `npm start`. It will launch a server, listening on port `4242`.

Then, configure your webserver to rewrite calls to missing files to your server. Here is an example for Apache:
```
RewriteEngine On
# it will download the file from SOURCE server before serving it
# this is useful when copying a database but without a knowledge of the useful files
# if file doesn't exist
RewriteCond %{REQUEST_FILENAME} !-f
# and it's fetched from a pattern (example: /sites/default/files)
RewriteCond %{REQUEST_URI} \/sites\/default\/files\/
# Rewrite as a proxy call
RewriteRule ^(.*)$ http://your-proxy-cache-server:4242/$1 [L]
```

At this point, when a file is called but missing locally, if its URI contains the pattern defined, the called will be routed to your proxy cache server. It will then request for the existing resource on another server, pipe the response to the browser while saving the asset locally so future calls won't trigger the proxy again.

This tool is especially handy for migration.

## Configuration

2 variables must be edited before launching your server. You can find them in `index.js`.

- `BASE_PATH`: absolute path prefix where to save assets. A call to `/sites/default/files/abc.png` will be saved to `${BASE_PATH}/sites/default/files/abc.png`
- `SOURCE_HOST`: URL to fetch resources from. A call to `/sites/default/files/abc.png` will be proxied to `${SOURCE_HOST}/sites/default/files/abc.png`
