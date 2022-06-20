function sortMatches(property) {
    var sortOrder = -1;
    if(property[0] === "-") {
        sortOrder = 1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function getQueueType (value) {
    switch(value) {
        case 1090:
            return "Normal Game"
        case 1100:
            return "Ranked Game"
        case 1130:
             return "Hyper Roll"
        case 1150:
        case 1160:
             return "Doube Up"
        default:
          return "Unknown";
      }
};

export default {
    sortMatches,
    getQueueType
}