let articles = {};
const cruiseLawNewsArticles = require("../scrapers/cruiseLawNews_scraper");
const iLikeCruiseShipsArticles = require("../scrapers/iLikeCruiseShips_scraper");
const cruiseIndustryNewsArticles = require("../scrapers/cruiseIndustryNews_scraper");
const _ = require("underscore");

async function runAllScrapers() {
  try {
    articles.cruiseIndustryNews = await cruiseIndustryNewsArticles();
    //console.log(articles.cruiseIndustryNews);

    //articles.iLikeCruiseShips = await iLikeCruiseShipsArticles();
    // articles.cruiseLawNews = await cruiseLawNewsArticles();
    return articles;
  } catch (err) {
    // catches errors both in fetch and response.json
    console.error(err);
  }
}

const cleanData = async () => {
  try {
    const result = await runAllScrapers();
    //console.log("result --------->", result);
    // const source = _.sample(Object.keys(result));
    //console.log(result.length);

    const source = "cruiseIndustryNews";
    // console.log("SOURCE --------->", source);

    const onlyShort = result[source].filter((article) => article.body.length < 4050);
    const withPhotos = onlyShort.filter((article) => article.image);
    const randomArticle = withPhotos[_.random(0, withPhotos.length - 1)];
    //console.log(`source => ${source}.com | title => ${randomArticle.title} | length => ${randomArticle.body.length}`);
    return randomArticle;
  } catch (err) {
    // catches errors both in fetch and response.json
    console.error(err);
  }
};

exports.runAllScrapers = runAllScrapers;
exports.cleanData = async () => {
  try {
    articles = await cleanData();
    return articles;
  } catch (err) {
    // catches errors both in fetch and response.json
    console.error(err);
  }
};

console.log(cleanData());
