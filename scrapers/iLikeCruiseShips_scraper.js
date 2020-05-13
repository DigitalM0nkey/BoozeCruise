const cheerio = require("cheerio");
const axios = require("axios");
let articles = [];

const getILikeCruiseShipsArticles = (url) =>
  new Promise(function (resolve, reject) {
    axios
      .get(url)
      .then((response) => {
        const $ = cheerio.load(response.data);
        // console.log($(".td-module-thumb > a").attr("href"));

        let urls = [];
        for (let i = 1; i < $(".td-module-thumb > a").length; i++) {
          urls.push($(".td-module-thumb > a")[i].attribs.href);
        }
        //console.log(urls);

        return urls;
      })
      .then((urls) => {
        Promise.all(urls.map((url) => axios.get(url))).then((responses) => {
          resolve(
            responses.map((response) => {
              const $ = cheerio.load(response.data);
              //console.log("body: ", $(".td-post-content p").text());

              return {
                image: $(".entry-thumb").attr("src"),
                title: $(".entry-title").text(),
                body: $(".td-post-content p").text(),
              };
            })
          );
        });
      })
      .catch((err) => {
        console.log("SCRAPER ERROR =>", err);
        reject(err);
      });
  });

//getILikeCruiseShipsArticles("http://ilikecruiseships.com/category/news/");

module.exports = async () => {
  if (articles.length === 0) {
    articles = await getILikeCruiseShipsArticles("http://ilikecruiseships.com/category/news/");
  }
  return articles;
};
/*
const clnArticles = (urls) =>
  axios
  .get(urls)
  .then((response) => {
    const $ = cheerio.load(response.data);
    const article = {
      image: $(".lxb_af-featured_image-get-img").attr("src"),
      title: $(".lxb_af-template_tags-get_post_title").text(),
      body: $(".lxb_af-post_content").text(),
    };
    articles.push(article);
    //console.log("ARTICLES => ", articles);
    return articles;
  })
  .catch(function(err) {
    console.log("SCRAPER ERROR =>", err);
  });

axios.all([cruiseLawNewsArticle("https://www.cruiselawnews.com/"), clnArticles("https://www.cruiselawnews.com/")]).then(
  axios.spread(function(acct, perms) {
    console.log(acct, perms);

    // Both requests are now complete
  })
);
*/
// console.log(cruiseLawNewsArticle(url));

// console.log(clnArticles(cruiseLawNewsArticle("https://www.cruiselawnews.com/")));
