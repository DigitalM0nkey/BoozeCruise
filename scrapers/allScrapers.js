let articles = [];
const cruiseLawNewsArticles = require("../scrapers/cruiseLawNews_scraper");
const iLikeCruiseShipsArticles = require("../scrapers/iLikeCruiseShips_scraper");
const cruiseIndustryNewsArticles = require("../scrapers/cruiseIndustryNews_scraper");
const cruiseHiveArticles = require("../scrapers/cruiseHive_scraper");
const _ = require("underscore");

async function runAllScrapers() {
  try {
    // articles.cruiseInsdustryNews = await cruiseIndustryNewsArticles();
    // articles.iLikeCruiseShips = await iLikeCruiseShipsArticles();
    // articles.cruiseLawNews = await cruiseLawNewsArticles();
    // const newArticle = (await cruiseIndustryNewsArticles()).concat(await cruiseLawNewsArticles());
    //console.log(newArticle);
    // return articles;
    return (await cruiseIndustryNewsArticles())
      .concat(await cruiseLawNewsArticles())
      // .concat(await iLikeCruiseShipsArticles())
      .concat(await cruiseHiveArticles());
  } catch (err) {
    // catches errors both in fetch and response.json
    console.error(err);
  }
}

const cleanData = async () => {
  if (articles.length === 0) {
    try {
      const result = await runAllScrapers();
      // console.log("result --------->", result);
      // const source = _.sample(Object.keys(result));
      let sources = Object.keys(result);
      //console.log("SOURCES =>", sources);

      //console.log(sources[_.random(0, sources.length - 1)]); //string is returned

      const source = sources[_.random(0, sources.length - 1)]; // refactor this line
      // const source = "cruiseIndustryNews";
      // console.log("SOURCE --------->", source);
      //const randNum = _.random(0, sources.length - 1);
      // console.log(randNum);

      // console.log("result[SOURCE] --------->", result[`${source}`][1].source);
      articles = result.filter((article) => article.image && article.body.length < 4050);

      //console.log(`source => ${source}.com | title => ${randomArticle.title} | length => ${randomArticle.body.length}`);
    } catch (err) {
      // catches errors both in fetch and response.json
      console.error(err);
    }
  }
  const randomArticle = articles[_.random(0, articles.length - 1)];
  // console.log("RANDOM ARTICLE", randomArticle);
  return randomArticle;
};

exports.cleanData = cleanData;

//console.log(cleanData());
