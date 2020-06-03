var db = require('../../../db');
var Artwork = db.model('Artwork', {
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: false
  },
  artist: {
    type: String,
    required: false
  }
});
module.exports = Artwork;