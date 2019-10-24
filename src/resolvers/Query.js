const { getTours, getTourByNameBD } = require("../utils");

function tourReducer(tour) {
  return {
    tourId: tour.tourId,
    price: tour.price,
    name: tour.name,
    startDate: tour.startDate,
    endDate: tour.endDate,
    type: tour.type,
    createdAt: tour.createdAt,
    createdAt: tour.createdBy,
    daysAvailable: tour.daysAvailable ? tour.daysAvailable : "",
    clasification: tour.clasification ? tour.clasification : "",
    cancellationPolicy: tour.cancellationPolicy ? tour.cancellationPolicy : "",
    discount: tour.discount ? tour.discount : "",
    quantity: tour.quantity ? tour.quantity : "",
    status: tour.status ? tour.status : "",
    photo: tour.photo ? tour.photo : ""
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

async function getTourByName(_, args) {
  const tour = await getTourByNameBD(args.name);
  if (!tour) {
    throw new Error("No such tour found");
  } else {
    return tourReducer(tour);
  }
}

module.exports = {
  tours,
  getTourByName
};
