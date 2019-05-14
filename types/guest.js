
var guest = {};

var guestTypes = [
//  {name: "Event 1", description: "this is a description", keyboard: keyboards.home},

  "poor",
  "middle class",
  "rich",

];

guest.pick = function(){
var distribution = Math.random() * 100;/*
if (distribution <= 15){
  index = 0;
} else if (distribution <= 95){
  index = 1;
} else {
  index = 2;
}
var index = Math.floor(Math.random() * guestTypes.length);*/
var index = distribution <= 15 ? 0 : distribution <= 95 ? 1 : 2;
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
