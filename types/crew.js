const CruiseDirector = require("./crew/cruise_director");

var crew = {};

crew.pick = function () {
  var crewTypes = [
    {
      title: "Social Host",
      crewStatus: "Staff",
    },
    {
      title: "Cruise Director",
      crewStatus: "Officer",
    },
    {
      title: "Art Auctioneer",
      crewStatus: "Staff",
    },
    {
      title: "Gift Shop Manager",
      crewStatus: "Staff",
    },
    {
      title: "Gift Shop Attendent",
      crewStatus: "Staff",
    },
    {
      title: "Cheif Engeneer",
      crewStatus: "Officer",
    },
    {
      title: "Server",
      crewStatus: "Crew",
    },
    {
      title: "Casino Host",
      crewStatus: "Staff",
    },
    {
      title: "DJ",
      crewStatus: "Staff",
    },
    {
      title: "Dancer",
      crewStatus: "Staff",
    },
  ];
  return crewTypes[Math.floor(Math.random() * crewTypes.length)];
};

crew.board = function () {};
crew.conversation = function () {
  return "Ain't no one else here, try the chatting to the Cruise Director \nType: /cd";
};
module.exports = function (crewType) {
  switch (crewType) {
    case "cruiseDirector":
      return CruiseDirector;

    default:
      return crew;
  }
};

// const events = [{
//       name: "Embarcation Day",
//       description: "New passangers are boarding your ship",
//       keyboard: keyboards.home
//     }]
