//document.getElementById("senate-data").innerHTML = JSON.stringify(
//data,
//null,
// 2
//);

//SHOW ALL THE PARTYS AT START
// if(filterArray.length == 0){
// createTable(array, id);
//}else {
//}
let members = "";
let url = document.URL;
var dots = document.getElementById("dots");
var moreText = document.getElementById("more");
var btnText = document.getElementById("myBtn");

if (url.includes("senate")) {
  url = "https://api.propublica.org/congress/v1/113/senate/members.json";
} else if (url.includes("house")) {
  url = "https://api.propublica.org/congress/v1/113/house/members.json";
} else if (url.includes("index")) {
  btnText.addEventListener("click", show);
} else {
  console.log("no found");
}
document.getElementById("alertmessageparty").style.display = "none"; // hidden alerts
document.getElementById("alertmessagedata").style.display = "none";

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

function init() {
  createFilterStates(filterState(members), "filtersselect");
  filterParty(members, "senate-data");
}

var filterRepublican = document.getElementById("republican");
var filterDemocrat = document.getElementById("democrat");
var filterIndependent = document.getElementById("independent");
var selector = document.getElementById("filtersselect");

filterRepublican.addEventListener("click", function() {
  filterParty(classifyStates(members), "senate-data");
});

filterDemocrat.addEventListener("click", function() {
  filterParty(classifyStates(members), "senate-data");
});

filterIndependent.addEventListener("click", function() {
  filterParty(classifyStates(members), "senate-data");
});

selector.addEventListener("change", function() {
  filterParty(classifyStates(members), "senate-data");
});

function filterParty(array, id) {
  var filterArray = [];
  for (let i = 0; i < array.length; i++) {
    if (document.getElementById("democrat").checked && array[i].party == "D") {
      filterArray.push(array[i]);
    } else if (
      document.getElementById("republican").checked &&
      array[i].party == "R"
    ) {
      filterArray.push(array[i]);
    } else if (
      document.getElementById("independent").checked &&
      array[i].party == "I"
    ) {
      filterArray.push(array[i]);
    }
  }

  if (
    document.getElementById("democrat").checked ||
    document.getElementById("republican").checked ||
    document.getElementById("independent").checked
  ) {
    document.getElementById("alertmessageparty").classList.remove("show"); //$("#alertmessageparty").removeClass("show");
    document.getElementById("alertmessagedata").classList.remove("show"); //$("#alertmessagedata").removeClass("show");
    document.getElementById("alertmessageparty").style.display = "none";
    document.getElementById("alertmessagedata").style.display = "none";
  } else {
    document.getElementById("alertmessageparty").style.display = "block";
    document.getElementById("alertmessagedata").style.display = "none";
    document.getElementById("alertmessageparty").classList.add("show"); //$("#alertmessageparty").addClass("show");
    document.getElementById("alertmessagedata").classList.remove("show"); //$("#alertmessagedata").removeClass("show");
  }
  if (
    document.getElementById("independent").checked &&
    filterArray.length == 0
  ) {
    document.getElementById("alertmessagedata").style.display = "block";
    document.getElementById("alertmessagedata").classList.add("show"); //$("#alertmessagedata").addClass("show");
  }

  createTable(filterArray, id);
}

function createTable(array, id) {
  var body = document.getElementById(id);
  body.innerHTML = " ";
  for (var i = 0; i < array.length; i++) {
    var row = document.createElement("tr");
    var cell1 = document.createElement("td");
    var link1 = document.createElement("a");
    link1.setAttribute("href", array[i].url);
    link1.setAttribute("target", array[i].url);
    var cell2 = document.createElement("td");
    var cell3 = document.createElement("td");
    var cell4 = document.createElement("td");
    var cell5 = document.createElement("td");

    link1.innerHTML =
      array[i].first_name +
      " " +
      (array[i].middle_name || " ") +
      " " +
      array[i].last_name;
    cell2.innerHTML = array[i].party;
    cell3.innerHTML = array[i].state;
    cell4.innerHTML = array[i].seniority;
    cell5.innerHTML = array[i].votes_with_party_pct;

    body.append(row);
    row.append(cell1, cell2, cell3, cell4, cell5);
    cell1.appendChild(link1);
  }
}

function filterState(array) {
  var arrayState = [];
  for (let i = 0; i < array.length; i++) {
    if (arrayState.includes(array[i].state) === false) {
      arrayState.push(array[i].state);
    }
  }

  arrayState.sort();

  return arrayState;
}

function createFilterStates(array, id) {
  var options2 = document.getElementById(id);

  for (let i = 0; i < array.length; i++) {
    var option1 = document.createElement("option");

    option1.innerHTML = array[i];
    options2.append(option1);
  }
}

function classifyStates(array) {
  var listen = selector.value;
  var classifyArray = [];
  for (let i = 0; i < array.length; i++) {
    if (listen == array[i].state || listen == "all") {
      classifyArray.push(array[i]);
    }
  }

  return classifyArray;
}

function show() {
  if (dots.style.display === "none") {
    dots.style.display = "inline";
    btnText.innerHTML = "Read more";
    moreText.style.display = "none";
  } else {
    dots.style.display = "none";
    btnText.innerHTML = "Read less";
    moreText.style.display = "inline";
  }
}
