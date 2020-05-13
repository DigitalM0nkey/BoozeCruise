let articles = [];
const cruiseLawNewsArticles = require("/scrapers/cruiseLawNews_scraper");
const iLikeCruiseShipsArticles = require("/iLikeCruiseShips_scraper");

iLikeCruiseShipsArticles().then((articles) => {
  let article = articles[Math.floor(Math.random() * articles.length)];
});
