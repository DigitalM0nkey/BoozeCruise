const cheerio = require("cheerio");
const axios = require("axios");
const articles = [];

const cruiseLawNewsArticle = url => new Promise(function(resolve, reject) {
  axios
    .get(url)
    .then(response => {
      const $ = cheerio.load(response.data);
      let urls = [];
      for (let i = 1; i < 11; i++) {
        urls.push($("h1 > a")[i].attribs.href);
      }
      return urls;
    })
    .then(urls => {
      Promise.all(urls.map(url =>
          axios.get(url)
        ))
        .then(responses => {
          resolve(responses.map(response => {
            const $ = cheerio.load(response.data);
            return {
              image: $(".lxb_af-featured_image-get-img").attr("src"),
              title: $(".lxb_af-template_tags-get_post_title").text(),
              body: $(".lxb_af-post_content").text(),
            };
          }));
        });

    })
    .catch(err => {
      console.log("SCRAPER ERROR =>", err);
      reject(err);
    });
});

cruiseLawNewsArticle("https://www.cruiselawnews.com/").then(articles => console.log(articles), console.error);

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