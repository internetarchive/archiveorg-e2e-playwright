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

    aboutFailed=`cat ctrf/about-summary.json | jq -r '.results.summary.failed' |  tr '\n' ' '`
    avFailed=`cat ctrf/av-summary.json | jq -r '.results.summary.failed' |  tr '\n' ' '`
    booksFailed=`cat ctrf/books-summary.json | jq -r '.results.summary.failed' |  tr '\n' ' '`
    homeFailed=`cat ctrf/home-summary.json | jq -r '.results.summary.failed' |  tr '\n' ' '`
    loginFailed=`cat ctrf/login-summary.json | jq -r '.results.summary.failed' |  tr '\n' ' '`
    profileFailed=`cat ctrf/profile-summary.json | jq -r '.results.summary.failed' |  tr '\n' ' '`

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

    collectionFailed=`cat ctrf/collection-summary.json | jq -r '.results.summary.failed' |  tr '\n' ' '`
    detailsFailed=`cat ctrf/details-summary.json | jq -r '.results.summary.failed' |  tr '\n' ' '`
    musicFailed=`cat ctrf/music-summary.json | jq -r '.results.summary.failed' |  tr '\n' ' '`
    searchFailed=`cat ctrf/search-summary.json | jq -r '.results.summary.failed' |  tr '\n' ' '`

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
