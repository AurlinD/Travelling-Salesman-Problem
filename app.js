const fs = require("fs");

// parses CSV value and converts data into JSON format
const readCSV = (data) => {
  let cities = data.split("\n");
  headers = cities.shift().split(",");
  result = [];

  for (let i = 0; i < cities.length; i++) {
    let obj = {};
    let row = cities[i].split(",");

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    result.push(obj);
  }
  return result;
};

// Main algorithm function
const algorithmTSP = (data) => {
  let path = [[], 0];
  let origin = data[0];
  path[0].push(origin.City);
  let latA = parseFloat(data[0].Latitude);
  let lonA = parseFloat(data[0].Longitude);

  return shortestPath(path, data, latA, lonA);
};

// greedy dijkstra's algorithm that looks at last item in path[0] city array,
// finds shortest distance city from that location
const shortestPath = (path, data, latA, lonA) => {
  let minDistanceCity = {};
  let minDistance = Number.POSITIVE_INFINITY;

  for (cityDetails of data) {
    if (cityDetails.City !== "") {
      let nameB = cityDetails.City;
      if (path[0].indexOf(nameB) === -1) {
        let latB = parseFloat(cityDetails.Latitude);
        let lonB = parseFloat(cityDetails.Longitude);
        let dist = haversineDistance([latA, lonA], [latB, lonB]);
        if (minDistance > dist) {
          minDistance = dist;
          minDistanceCity = {
            City: nameB,
            Latitude: latB,
            Longitude: lonB,
          };
        }
      }
    }
  }
  if (minDistance === Number.POSITIVE_INFINITY) {
    let finalPath = returnToHome(path, data, latA, lonA);
    return finalPath;
  } else {
    path[0].push(minDistanceCity.City);
    path[1] = path[1] + minDistance;
    let lat = minDistanceCity.Latitude;
    let lon = minDistanceCity.Longitude;
    return shortestPath(path, data, lat, lon);
  }
};

// Haversine Forumula, looked up stackedOverflow
// Calculates distance in kilometers when givin lat and lon of 2 coordinates
const haversineDistance = ([lat1, lon1], [lat2, lon2]) => {
  const toRadian = (angle) => (Math.PI / 180) * angle;
  const distance = (a, b) => (Math.PI / 180) * (a - b);
  const RADIUS_OF_EARTH_IN_KM = 6371;

  const dLat = distance(lat2, lat1);
  const dLon = distance(lon2, lon1);

  lat1 = toRadian(lat1);
  lat2 = toRadian(lat2);

  const a =
    Math.pow(Math.sin(dLat / 2), 2) +
    Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.asin(Math.sqrt(a));

  let finalDistance = RADIUS_OF_EARTH_IN_KM * c;

  return finalDistance;
};

// adds final destination which is the first location in the data aka San Fransisco
const returnToHome = (path, data, latA, lonA) => {
  let originDistance = haversineDistance(
    [latA, lonA],
    [data[0].Latitude, data[0].Longitude]
  );
  path[0].push(data[0].City);
  path[1] = path[1] + originDistance;

  return path;
};

//------------------------------------------------------MAIN() COMMANDS-------------------------------------------------------------
let contents = fs.readFileSync("./cities_all.csv", "utf8");
let json = readCSV(contents);
let presRoute = algorithmTSP(json);
console.log(
  "FINAL OUTPUT **********************************",
  JSON.stringify(presRoute)
);
