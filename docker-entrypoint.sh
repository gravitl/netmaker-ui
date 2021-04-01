#!/bin/sh -eu
./generate_config_js.sh >/usr/share/nginx/html/config.js
echo ">>>> backend set to: $BACKEND_URL <<<<<"
nginx -g "daemon off;"
