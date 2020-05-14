let articles = {};
const cruiseLawNewsArticles = require("../scrapers/cruiseLawNews_scraper");
const iLikeCruiseShipsArticles = require("../scrapers/iLikeCruiseShips_scraper");

async function runAllScrapers() {
  articles.iLikeCruiseShips = await iLikeCruiseShipsArticles();
  articles.cruiseLawNews = await cruiseLawNewsArticles();
  return articles;
}

exports.runAllScrapers = runAllScrapers;
