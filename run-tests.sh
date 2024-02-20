TIMEFORMAT='It took %0R seconds.' 
time {
  npm run test:books
  npm run test:login
  npm run test:music
  npm run test:search
  npm run test:collection
}