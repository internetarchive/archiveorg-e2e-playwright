#!/bin/bash

TIMEFORMAT='It took %0R seconds.'

run_short_tests() {
  echo 'Run short tests'

  time {
    npm run test:about
    npm run test:av
    npm run test:books
    npm run test:home
    npm run test:login
    npm run test:profile

    aboutFailed=`cat playwright-summary/about-summary.json | jq -r '.errors[]' |  tr '\n' ' '`
    avFailed=`cat playwright-summary/av-summary.json | jq -r '.errors[]' |  tr '\n' ' '`
    booksFailed=`cat playwright-summary/books-summary.json | jq -r '.errors[]' |  tr '\n' ' '`
    homeFailed=`cat playwright-summary/home-summary.json | jq -r '.errors[]' |  tr '\n' ' '`
    loginFailed=`cat playwright-summary/login-summary.json | jq -r '.errors[]' |  tr '\n' ' '`
    profileFailed=`cat playwright-summary/profile-summary.json | jq -r '.errors[]' |  tr '\n' ' '`

    echo "about tests failed: $aboutFailed"
    echo "av tests failed: $avFailed"
    echo "books tests failed: $booksFailed"
    echo "home tests failed: $homeFailed"
    echo "login tests failed: $loginFailed"
    echo "profile tests failed: $profileFailed"
  }

  echo 'End of short tests execution'
}

run_long_tests() {
  echo 'Run long tests'

  time {
    npm run test:collection
    npm run test:details
    npm run test:music
    npm run test:search

    collectionFailed=`cat playwright-summary/collection-summary.json | jq -r '.errors[]' |  tr '\n' ' '`
    detailsFailed=`cat playwright-summary/details-summary.json | jq -r '.errors[]' |  tr '\n' ' '`
    musicFailed=`cat playwright-summary/music-summary.json | jq -r '.errors[]' |  tr '\n' ' '`
    searchFailed=`cat playwright-summary/search-summary.json | jq -r '.errors[]' |  tr '\n' ' '`

    echo "collection tests failed: $collectionFailed"
    echo "details tests failed: $detailsFailed"
    echo "music tests failed: $musicFailed"
    echo "search tests failed: $searchFailed"
  }

  echo 'End of long tests execution'
}

while getopts t:b: flag
do
  case "${flag}" in
    t) type=${OPTARG};;
    b) browser=${OPTARG};;
  esac
done

printf "Test type: $type - Browser: $browser\n";

if [ $type = 'short' ]; then
    run_short_tests
elif [ $type = 'long' ]; then
    run_long_tests
else
	echo "should run all"
fi

if [ $browser = 'chrome' ]; then
    npm run test:chromium
elif [ $browser = 'firefox' ]; then
    npm run test:firefox
elif [ $browser = 'webkit' ]; then
    npm run test:webkit
else
	echo "should run all"
fi
