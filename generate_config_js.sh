#!/bin/sh -eu
if [ -z "${BACKEND_URL:-}" ]; then
    BACKEND_URL="http://localhost:8081"
fi

if [ -z "${MASTER_KEY:-}" ]; then
    MASTER_KEY="secretkey"
fi


cat <<EOF
window.REACT_APP_BACKEND='$BACKEND_URL';
window.REACT_APP_KEY='$MASTER_KEY';
EOF
