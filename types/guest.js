
var guest = {};

var guestTypes = [
//  {name: "Event 1", description: "this is a description", keyboard: keyboards.home},

  "Poor",
  "Middle Class",
  "Rich",

];

guest.pick = function(){
var index = Math.floor(Math.random() * guestTypes.length);
  return {
    type: index,
    purse: Math.floor((500 + Math.random() * 4500) * Math.pow(10, index))
    };
};

guest.getType = function(index){
  return guestTypes[index];
};

guest.board = function(){

}

module.exports = guest;
