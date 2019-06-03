import fitlogger from 'fitbit-logger/app'
 
const options = {
  doConsoleLog: true,
  automaticInterval: 5000,
  prefix: 'App'
}
fitlogger.init(options);

export default fitlogger;
