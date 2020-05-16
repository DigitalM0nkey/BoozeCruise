let articles = {};
const cruiseLawNewsArticles = require("../scrapers/cruiseLawNews_scraper");
const iLikeCruiseShipsArticles = require("../scrapers/iLikeCruiseShips_scraper");
const _ = require("underscore");

async function runAllScrapers() {
  articles.iLikeCruiseShips = await iLikeCruiseShipsArticles();
  articles.cruiseLawNews = await cruiseLawNewsArticles();
  return articles;
}

const cleanData = () => {
  runAllScrapers().then((result) => {
    const source = _.sample(Object.keys(result));
    const onlyShort = result[source].filter((article) => article.body.length < 4050);
    const withPhotos = onlyShort.filter((article) => article.image);
    const randomArticle = withPhotos[_.random(0, withPhotos.length)];
    console.log(`source => ${source}.com `, "title => ", randomArticle.title);
    return randomArticle;
  });
};

exports.runAllScrapers = runAllScrapers;
exports.cleanData = async () => {
  articles = await cleanData();
  return articles;
};
