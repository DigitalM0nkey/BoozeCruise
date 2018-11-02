var crew = {};

crew.pick = function() {
  var crewTypes = [{
      title: "Social Host",
      crewStatus: "Staff"
    },
    {
      title:"Cruise Director",
      crewStatus:""
    },
    {
      title:"Art Auctioneer",
      crewStatus:""
    };
    {
      title: "Gift Shop Manager",
      crewStatus:""
    },
    {
      title: "Gift Shop Attendent",
      crewStatus: "Staff"
    },
    {
      title: "Cheif Engeneer",
      crewStatus: "Officer"
    },
    {
      title: "Server",
      crewStatus: "Crew"
    },
    {
      title: "Casino Host",
      crewStatus: "Staff"
    },
    {
      title: "DJ",
      crewStatus: "Staff"
    },
    {
      title: "Dancer",
      crewStatus: "Staff"
    },
  ]
}
return crewTypes[Math.floor(Math.random() * crewTypes.length)];
};

crew.board = function() {

}

module.exports = crew;

var events = [{
      name: "Embarcation Day",
      description: "New passangers are boarding your ship",
      keyboard: keyboards.home
    },
