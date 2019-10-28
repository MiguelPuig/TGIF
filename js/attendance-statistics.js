var statistics = {
  Democrats: 0,
  Republicans: 0,
  Independents: 0,
  Total: 0
};
console.log(statistics);

let members = "";
let url = document.URL;
props = {
  totalAttendance: "missed_votes",
  percentageAttendance: "missed_votes_pct",
  totalParty: "total_votes",
  percentageParty: "votes_with_party_pct"
};

if (url.includes("senate")) {
  url = "https://api.propublica.org/congress/v1/113/senate/members.json";
} else if (url.includes("house")) {
  url = "https://api.propublica.org/congress/v1/113/house/members.json";
} else {
  console.log("no found");
}

fetch(url, {
  method: "GET",
  headers: {
    "X-API-Key": "w9Ddk5TaecRPFKUclOP5hQNdy3UtXykafp0q5M4d"
  }
})
  .then(response => {
    return response.json();
  })
  .then(data => {
    console.log(data);
    members = data.results[0].members;
    init();
    document.getElementById("spinner").style.display = "none";
  })
  .catch(error => {
    console.log(error);
  });

// FUNCTIONS CALL

function init() {
  votes(members);
  average(members);

  if (document.URL.includes("attendance")) {
    let bottomTenPercentArray = addRepitedPercentage(
      calculateLeastEngaged(members)
    );
    let topTenPercentArray = addRepitedPercentage(
      calculateMostEngaged(members)
    );
    createEngagedTable(bottomTenPercentArray, "body1");
    createEngagedTable(topTenPercentArray, "body2");
  } else {
    let bottomTenPercentArrayParty = calculateLeastEngagedParty(members);
    let topTenPercentArrayParty = calculateMostEngagedParty(members);
    createEngagedTableParty(bottomTenPercentArrayParty, "body3");
    createEngagedTableParty(topTenPercentArrayParty, "body4");
  }
}
// TABLES ALL THE HTMLS

function votes(array) {
  var republican = [];
  var democrat = [];
  var independent = [];
  for (var i = 0; i < array.length; i++) {
    if (array[i].party === "D") {
      democrat.push(array[i]);
    } else if (array[i].party == "R") {
      republican.push(array[i]);
    } else if (array[i].party == "I") {
      independent.push(array[i]);
    }

    var x = document.getElementById("rep");
    x.innerHTML = republican.length;
    var y = document.getElementById("dem");
    y.innerHTML = democrat.length;
    var z = document.getElementById("ind");
    z.innerHTML = independent.length;
    var total = document.getElementById("total");
    total.innerHTML = republican.length + democrat.length + independent.length;
  }
  console.log(republican);
}

function average(array) {
  var votosR = [];
  var votosD = [];
  var votosI = [];
  var sum = 0;
  var sum1 = 0;
  var sum2 = 0;
  var averageR = 0;
  var averageD = 0;
  var averageI = 0;
  var averageT;
  for (let i = 0; i < array.length; i++) {
    if (array[i].party === "D") {
      votosD.push(array[i].votes_with_party_pct);
    } else if (array[i].party == "R") {
      votosR.push(array[i].votes_with_party_pct);
    } else if (array[i].party == "I") {
      votosI.push(array[i].votes_with_party_pct);
    }
  }
  for (let j = 0; j < votosR.length; j++) {
    if ((sum += votosR[j])) {
      averageR = sum / votosR.length;
    }
  }
  for (let k = 0; k < votosD.length; k++) {
    if ((sum1 += votosD[k])) {
      averageD = sum1 / votosD.length;
    }
  }
  for (let l = 0; l < votosI.length; l++) {
    if ((sum2 += votosI[l])) {
      averageI = sum2 / votosI.length;
    }
  }

  var x = document.getElementById("rep1");
  x.innerHTML = averageR.toFixed(2);
  var y = document.getElementById("dem1");
  y.innerHTML = averageD.toFixed(2);
  var z = document.getElementById("ind1");
  z.innerHTML = averageI.toFixed(2);
  console.log(averageI);
  averageT = parseFloat(
    (sum + sum1 + sum2) / (votosR.length + votosD.length + votosI.length)
  );

  var total = document.getElementById("total1");
  total.innerHTML = averageT.toFixed(2);
}

// ATTENDANCE

function calculateLeastEngaged(array) {
  return [
    ...array.sort(function(a, b) {
      return a.missed_votes_pct - b.missed_votes_pct;
    })
  ];
}

function calculateMostEngaged(array) {
  return [
    ...array.sort(function(a, b) {
      return b.missed_votes_pct - a.missed_votes_pct;
    })
  ];
}

function addRepitedPercentage(array) {
  var newArray = [];
  for (let i = 0; i < array.length; i++) {
    if (i < 0.1 * array.length) {
      newArray.push(array[i]);
    } else if (
      newArray[newArray.length - 1].missed_votes_pct ==
      array[i].missed_votes_pct
    ) {
      newArray.push(array[i]);
    } else {
      break;
    }
  }
  console.log(newArray);
  return newArray;
}

function createEngagedTable(array, id) {
  var body = document.getElementById(id);
  for (let i = 0; i < array.length; i++) {
    var row = document.createElement("tr");
    var cell1 = document.createElement("td");
    var link1 = document.createElement("a");
    link1.setAttribute("href", array[i].url);
    link1.setAttribute("target", array[i].url);
    var cell2 = document.createElement("td");
    var cell3 = document.createElement("td");

    link1.innerHTML =
      array[i].first_name +
      " " +
      (array[i].middle_name || " ") +
      " " +
      array[i].last_name;

    cell2.innerHTML = array[i].missed_votes;
    cell3.innerHTML = array[i].missed_votes_pct;
    body.append(row);
    row.append(cell1, cell2, cell3);
    cell1.appendChild(link1);
  }
  console.log(props.percentage);
}

// PARTY LOYALTY

function createEngagedTableParty(array, id) {
  var body = document.getElementById(id);
  for (let i = 0; i < 0.1 * array.length; i++) {
    var row = document.createElement("tr");
    var cell1 = document.createElement("td");
    var link1 = document.createElement("a");
    link1.setAttribute("href", array[i].url);
    link1.setAttribute("target", array[i].url);
    var cell2 = document.createElement("td");
    var cell3 = document.createElement("td");

    link1.innerHTML =
      array[i].first_name +
      " " +
      (array[i].middle_name || " ") +
      " " +
      array[i].last_name;

    cell2.innerHTML = array[i].total_votes;
    cell3.innerHTML = array[i].votes_with_party_pct;
    body.append(row);
    row.append(cell1, cell2, cell3);
    cell1.appendChild(link1);
  }
  console.log();
}

function calculateLeastEngagedParty(array) {
  return [
    ...array.sort(function(a, b) {
      return a.votes_with_party_pct - b.votes_with_party_pct;
    })
  ];
}
function calculateMostEngagedParty(array) {
  return [
    ...array.sort(function(a, b) {
      return b.votes_with_party_pct - a.votes_with_party_pct;
    })
  ];
}
