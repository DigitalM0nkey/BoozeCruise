
var guest = {};

guest.pick = function(){
  var guestTypes = [
  //  {name: "Event 1", description: "this is a description", keyboard: keyboards.home},
    "Pirate",
    "Stowaway",
    "Sailor",
    "Passenger",
  ]
  return guestTypes[Math.floor(Math.random() * guestTypes.length)];
};

guest.board = function(){

}

module.exports = guest;
