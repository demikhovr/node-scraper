const { Fields } = require('./constants');

module.exports = {
  parse($, url) {
    return $('.article-article')
      .filter((i, it) => {
        const tags = $(it).find('.tags a:contains("react")');
        return tags.length;
      })
      .toArray()
      .map((it) => ({
        [Fields.AUTHOR]: $(it).find('.author-name').text().trim(),
        [Fields.AVATAR]: $(it).find('.author-avatar .avatar').attr('src'),
        [Fields.CREATED_AT]: $(it).find('.article-publication-meta time').attr('datetime'),
        [Fields.LINK]: url,
        [Fields.TITLE]: $(it).find('h2').text().trim(),
      }));
  },
  getNextPageUrl($) {
    return $('.breadcrumbs-next-page a').attr('href');
  },
};
