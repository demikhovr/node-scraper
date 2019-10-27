module.exports = {
  REQUEST_DELAY: 150,
  CONCURRENCY: 2,
  Fields: {
    AUTHOR: 'author',
    AVATAR: 'avatar',
    CREATED_AT: 'created_at',
    LINK: 'link',
    TITLE: 'title',
  },
  Urls: {
    TARGET: 'https://css-tricks.com/archives/page/1/',
    PROXY: 'socks5://95.216.192.19:443',
  },
  Output: {
    JSON: './output/data.json',
    CSV: './output/data.csv',
  },
};
