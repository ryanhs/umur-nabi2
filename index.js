const bluebird = require("bluebird");
const fs = bluebird.promisifyAll(require("fs"));
const path = require("path");

const separator = "==>";

const formatSMSM = /\d{1,4}-\d{1,4} SM/;
function calculateSMSM(period) {
  const [start, end] = period
    .replace(" SM", "").split("-")
    .map((v) => parseInt(v, 10));
  return start - end;
}

const formatSMM = /\d{1,4} SM-\d{1,4} M/;
function calculateSMM(period) {
  const [start, end] = period
    .replace(" SM", "").replace(" M", "").split("-")
    .map((v) => parseInt(v, 10));
  return start + end;
}

const formatM = /\d{1,4}-\d{1,4} M/;
function calculateM(period) {
  const [start, end] = period
    .replace(" M", "").split("-")
    .map((v) => parseInt(v, 10));
  return end - start;
}

;(async () => {
  const dataFile = path.resolve('./data.txt');
  const dataString = (await fs.readFileAsync(dataFile)).toString();
  const dataFormatted = dataString
    .replaceAll('\r', '').split('\n')
    .filter(v => !!v.trim())
    .map(line => {
      const [name, period] = line.split(separator).map(v => v.trim());
      const age = period.match(formatSMSM)
        ? calculateSMSM(period)
        : period.match(formatSMM) ? calculateSMM(period) : calculateM(period);

      return { name, period, age };
    });

  console.table(dataFormatted);
})();