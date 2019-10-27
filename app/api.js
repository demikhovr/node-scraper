const request = require('request-promise');
const SocksProxyAgent = require('socks-proxy-agent');
const iconv = require('iconv-lite');

const { Urls } = require('./constants');

const REQUEST_OPTIONS = {
  method: 'GET',
  resolveWithFullResponse: true,
  encoding: null,
  agent: new SocksProxyAgent(Urls.PROXY),
};

// eslint-disable-next-line no-async-promise-executor
const withRetry = (asyncFn, interval = 1000) => new Promise(async (resolve, reject) => {
  try {
    const response = await asyncFn();
    resolve(response);
  } catch (err) {
    setTimeout(() => withRetry(asyncFn, interval).then(resolve, reject), interval);
  }
});

// eslint-disable-next-line no-async-promise-executor
const load = async (uri) => new Promise(async (resolve, reject) => {
  try {
    const response = await request({ uri, ...REQUEST_OPTIONS });
    const body = iconv.decode(response.body, 'win1251');
    resolve(body);
  } catch (err) {
    reject(err);
  }
});

module.exports = {
  load,
  withRetry,
};
