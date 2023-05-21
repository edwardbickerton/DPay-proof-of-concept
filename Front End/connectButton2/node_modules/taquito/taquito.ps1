# Get the current directory and see if it's a Mozu Repp
$repo=$(basename (pwd))

$scriptDir = dirname $PSScriptRoot
# Find script source so we can run node from that place
$dir= $(cd $scriptDir; pwd)
cd $dir

npm start -- taquito.js $args --dir $repo