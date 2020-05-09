//const rp = require("request-promise");
const cheerio = require("cheerio");
const axios = require("axios");
const url = "https://www.cruiselawnews.com/";
const articles = [];

const cruiseLawNewsArticle = function (url) {
  axios
    .get(url)
    .then((response) => {
      const $ = cheerio.load(response.data);
      let urls = [];
      for (let i = 1; i < 11; i++) {
        urls.push($("h1 > a")[i].attribs.href);
      }
      return urls;
    })
    .then((urls) => {
      urls.forEach((url) => {
        axios.get(url).then((response) => {
          const $ = cheerio.load(response.data);
          //console.log($(".lxb_af-featured_image-get-img").attr("src"));

          //console.log($.html());
          const article = {
            image: $(".lxb_af-featured_image-get-img").attr("src"),
            title: $(".lxb_af-template_tags-get_post_title").text(),
            body: $(".lxb_af-post_content").text(),
          };
          articles.push(article);
          console.log("ARTICLES => ", articles);
          return articles;
        });

        //console.log($(".lxb_af-template_tags-get_post_title").text());

        // console.log($(".lxb_af-template_tags-get_post_title").text());
      });

      // console.log(articles);
    })
    .catch(function (err) {
      console.log("SCRAPER ERROR =>", err);
    });
};
console.log(cruiseLawNewsArticle(url));

// The pre.highlight.shell CSS selector matches all `pre` elements
// that have both the `highlight` and `shell` class
// const urlElems = $('pre.highlight.shell')

// const article = {
//   title: $(".lxb_af-template_tags-get_post_title").text(),
//   body: $(".lxb_af-post_content").text(),
// };
// articles.push(article);
// console.log(articles);
// // We now loop through all the elements found
// for (let i = 0; i < urlElems.length; i++) {
//   // Since the URL is within the span element, we can use the find method
//   // To get all span elements with the `s1` class that are contained inside the
//   // pre element. We select the first such element we find (since we have seen that the first span
//   // element contains the URL)
//   const urlSpan = $(urlElems[i]).find('span.s1')[0]

//   // We proceed, only if the element exists
//   if (urlSpan) {
//     // We wrap the span in `$` to create another cheerio instance of only the span
//     // and use the `text` method to get only the text (ignoring the HTML)
//     // of the span element
//     const urlText = $(urlSpan).text()

//     // We then print the text on to the console
//     console.log(urlText)
// }
// }

// rp(url)
//   .then(function (html) {
//     //success!
//     //console.log(html);
//     //console.log($("h1 > a", html).length);
//     // console.log($("h1 > a", html));
//     // console.log($("h1 > a", html).text());
//     const urls = [];
//     for (let i = 1; i < 11; i++) {
//       urls.push($("h1 > a", html)[i].attribs.href);
//     }
//     // console.log("URLS => ", urls);

//     return Promise.all(
//       urls.map((url) => {
//         // console.log("scraper url => ", url);
//         // console.log(article(url));

//         return article(url);
//       })
//     );
//     //console.log(urls);
//   })
//   .then(function (html) {
//     //console.log(html);
//   })
//   .catch(function (err) {
//     console.log("SCRAPER ERROR =>", err);
//   });

// const article = (url) => {
//   rp(url)
//     .then(function (html) {
//       return {
//         title: $(".lxb_af-template_tags-get_post_title", html).text(),
//         body: $(".lxb_af-post_content", html).text(),
//       };
//       //console.log("scraped article ", article);

//       // return article;
//     })
//     .catch(function (err) {
//       console.log("ERROR => ", err);
//     });
// };

// console.log(
//   article(
//     "https://www.cruiselawnews.com/2020/04/articles/disease/cruise-covid-19-norwegian-gem-crew-member-tested-positive-for-coronavirus/"
//   )
// );
