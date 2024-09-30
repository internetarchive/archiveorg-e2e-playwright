TIMEFORMAT='It took %0R seconds.' 
time {
  npm run test -- --test=about
  npm run test -- --test=av
  npm run test -- --test=books
  npm run test -- --test=collection
  npm run test -- --test=details
  npm run test -- --test=donation
  npm run test -- --test=home
  npm run test -- --test=login
  npm run test -- --test=music
  npm run test -- --test=profile
  npm run test -- --test=search
}
