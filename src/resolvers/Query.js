const { getTours } = require("../utils");

function tourReducer(tour) {
  return {
    tourId: tour.tourId,
    price: tour.price,
    name: tour.name
  };
}

async function tours() {
  const tours = await getTours();
  if (tours) {
    return Array.isArray(tours) ? tours.map(tour => tourReducer(tour)) : [];
  } else {
    throw new Error("Internal Server Error (500)");
  }
}

module.exports = {
  tours
};
