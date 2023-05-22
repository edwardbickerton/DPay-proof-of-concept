#!/bin/bash

# Get the current directory and see if it's a Mozu Repp
REPO=$(basename "$PWD")

# Find script source so we can run node from that place
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd $DIR

# Fire it up
npm start -- taquito.js $@ --dir "$REPO"