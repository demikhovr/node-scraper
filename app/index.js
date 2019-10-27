const async = require('async');
const cheerio = require('cheerio');
const log = require('cllc')();

const {
  REQUEST_DELAY,
  CONCURRENCY,
  Fields,
  Urls,
  Output,
} = require('./constants');
const {
  clearFile,
  updateFile,
  getCSVWriter,
  delay,
} = require('./utils');
const { load, withRetry } = require('./api');
const { parse, getNextPageUrl } = require('./parser');

const CHEERIO_OPTIONS = { xml: { normalizeWhitespace: true } };
const CSVWriter = getCSVWriter(Fields, Output.CSV);
const output = [];

const handleFinishQueue = async () => {
  await CSVWriter.writeRecords(output);
  log.finish();
  log('Finish parsing hotels.');
};

const init = () => {
  clearFile(Output.JSON);
  const queue = async.queue((url, done) => {
    log.step(0, 1);

    (async () => {
      try {
        const response = await withRetry(() => load(url));
        const $ = cheerio.load(response, CHEERIO_OPTIONS);
        const data = parse($, url);
        const nextPageUrl = getNextPageUrl($);

        if (data && data.length) {
          output.push(...data);
          updateFile(Output.JSON, ...data);
          log.step(data.length);
        }

        if (nextPageUrl) {
          await delay(REQUEST_DELAY);
          queue.push(nextPageUrl, (err) => {
            if (err) {
              log.error(err);
            }
          });
        }

        done();
      } catch (err) {
        log.error(err);
      }
    })();
  }, CONCURRENCY);

  queue.drain(handleFinishQueue);

  log('Start parsing.');
  log.start('Parsed: %s articles.');

  queue.push(Urls.TARGET);
};

init();
