#!/bin/sh -eu
if [ -z "${BACKEND_URL:-}" ]; then
    BACKEND_URL="http://localhost:8081"
fi
 
cat <<EOF
window.REACT_APP_BACKEND='$BACKEND_URL';
EOF
