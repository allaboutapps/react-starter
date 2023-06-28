#!/bin/bash

# Function to check if URL is reachable with status 200 -> used to verify our docker image can be hosted on different base URLs
check_url() {
    url="$1"
    response=$(curl --silent --head --output /dev/null --write-out "%{http_code}" "$url")
    
    if [[ $response -eq 200 ]]; then
        echo "URL is reachable with status 200"
        exit 0
    else
        echo "URL is not reachable or returned a different status code: $response"
        exit 1
    fi
}

# Usage: ./check_url.sh <url>
if [[ $# -ne 1 ]]; then
    echo "Usage: $0 <url>"
    exit 1
fi

url="$1"
check_url "$url"
