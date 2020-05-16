let articles = {};
const cruiseLawNewsArticles = require("../scrapers/cruiseLawNews_scraper");
const iLikeCruiseShipsArticles = require("../scrapers/iLikeCruiseShips_scraper");
const _ = require("underscore");

async function runAllScrapers() {
  articles.iLikeCruiseShips = await iLikeCruiseShipsArticles();
  articles.cruiseLawNews = await cruiseLawNewsArticles();
  return articles;
}

const cleanData = async () => {
  const result = await runAllScrapers();
  const source = _.sample(Object.keys(result));
  const onlyShort = result[source].filter((article) => article.body.length < 4050);
  const withPhotos = onlyShort.filter((article) => article.image);
  const randomArticle = withPhotos[_.random(0, withPhotos.length - 1)];
  console.log(`source => ${source}.com | title => ${randomArticle.title} | length => ${randomArticle.body.length}`);
  return randomArticle;
};

exports.runAllScrapers = runAllScrapers;
exports.cleanData = async () => {
  articles = await cleanData();
  return articles;
};

console.log(cleanData());
