#!/bin/bash
TIMEFORMAT='It took %0R seconds.'

run_all_tests() {
  npm run test:about
  npm run test:av
  npm run test:books
  npm run test:collection
  npm run test:details
  npm run test:donation
  npm run test:home
  npm run test:login
  npm run test:music
  npm run test:profile
  npm run test:search
}

checkBrowser () {
  if [ $browser = 'chrome' ]; then
      npm run test:chrome
  elif [ $browser = 'firefox' ]; then
      npm run test:firefox
  elif [ $browser = 'webkit' ]; then
      npm run test:webkit
  else
    echo "browser not identified"
  fi
}

while getopts b: flag
do
  case "${flag}" in
    b) browser=${OPTARG};;
  esac
done

printf "Browser: $browser\n";

if [ -z "$browser" ]; then
  echo "No vars for browser - running all tests by category"
  run_all_tests
elif ! [ -z "$browser" ]; then
  checkBrowser
else
  echo "should run all"
fi
