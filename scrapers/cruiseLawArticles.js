const rp = require("request-promise");
const $ = require("cheerio");

const cruiseLawNewsArticle = function (url) {
  //console.log("Article url => ", url);

  rp(url)
    .then(function (html) {
      //console.log(html);
      // let image = "";
      // if ($(".lxb_af-featured_image-get-img", html)["0"].attribs.src) {
      //   image = $(".lxb_af-featured_image-get-img", html)["0"].attribs.src;
      // } else {
      //   image = "NO IMAGE";
      // }

      const article = {
        title: $(".lxb_af-template_tags-get_post_title", html).text(),
        body: $(".lxb_af-post_content", html).text(),
      };
      //console.log("scraped article ", article);

      return article;
      // {
      // image: $(".lxb_af-featured_image-get-img", html)["0"].attribs.src
      //   ? $(".lxb_af-featured_image-get-img", html)["0"].attribs.src
      //   : "NO IMAGE",
      // title: $(".lxb_af-template_tags-get_post_title", html).text(),
      // body: $(".lxb_af-post_content", html).text(),
      // };
      // console.log($(".lxb_af-template_tags-get_post_title", html).text());
      // $(".lxb_af-featured_image-get-img", html)["0"].attribs.src
      //   ? console.log($(".lxb_af-featured_image-get-img", html)["0"].attribs.src)
      //   : console.log("NO IMAGE");
      // console.log($(".lxb_af-post_content", html).text());
    })
    .catch(function (err) {
      //handle error
      console.log("ERROR => ", err);
    });
};

module.exports = cruiseLawNewsArticle;
