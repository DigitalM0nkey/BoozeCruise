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
    let source = _.sample(Object.keys(result));
    console.log(result[source][_.random(0, 10)].title);
  });
};

cleanData();
exports.runAllScrapers = runAllScrapers;
