export default function normConfigCase(config) {
  return Object.keys(config).reduce((previousValue, key) => {
    previousValue[key.toLowerCase()] = config[key];
    return previousValue;
  }, {});
}
