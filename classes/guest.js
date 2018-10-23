module.exports = function(){
  var guest = this;
  guest.type = '';
  guest.pick = function(){
    var guestTypes = [
      "Pirate",
      "Stowaway",
      "Sailor",
      "Passenger",
    ]
    guest.type = guestTypes[Math.floor(Math.random() * guestTypes.length)]
    console.log(guest.type);
  };
}
