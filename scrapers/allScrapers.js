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
    console.log("source => ", source, "title => ", randomArticle.title);

    // let randomArticle = () => {
    //   let rando = result[source][_.random(0, result[source].length)];
    //   while (rando.body.length > 4050) {
    //     rando = result[source][_.random(0, result[source].length)];
    //   }
    // };

    // const words = ["spray", "limit", "elite", "exuberant", "destruction", "present"];

    // const result = words.filter((word) => word.length > 6);

    // console.log(result);
    // expected output: Array ["exuberant", "destruction", "present"]

    // console.log(randomArticle());
  });
};

cleanData();
exports.runAllScrapers = runAllScrapers;
exports.cleanData = cleanData;
