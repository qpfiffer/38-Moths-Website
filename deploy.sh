#!/bin/bash -e

rsync -Paz built/* static shithouse.tv:/var/www/38-moths/
