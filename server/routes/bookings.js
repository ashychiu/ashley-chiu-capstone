const express = require("express");
const bookingRouter = express.Router();
const { v4: uuid } = require("uuid");
const fs = require("fs");

const readFile = () => {
  const bookingData = fs.readFileSync("./data/bookings.json");
  return JSON.parse(bookingData);
};

const writeFile = (bookingData) => {
  fs.writeFileSync(
    "./data/bookings.json",
    JSON.stringify(bookingData, null, 2)
  );
};

let bookingList = readFile();

// get all bookings
bookingRouter.get("/", (req, res) => {
  return res.status(200).json(bookingList);
});

// get single booking by id
const getBooking = (id) => {
  const foundBooking = bookingList.find((booking) => {
    return id === booking.id;
  });
  return foundBooking;
};

//API Get single booking
bookingRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  const foundBooking = getBooking(id);
  if (!foundBooking) {
    return res.status(404).send("Booking details not found!");
  }
  return res.status(200).json(foundBooking);
});

//Add new booking
bookingRouter.post("/add", (req, res) => {
  const { requestDate, sumbitDate, userID, carPlate, remarks } = req.body;

  if (!carPlate || !requestDate) {
    return res.status(400).send("Please fill out the required fields");
  }
  if (carPlate.length < 2 || carPlate.length > 8) {
    return res
      .status(400)
      .send("Please provide a valid North American license plate");
  }

  const newBooking = {
    id: uuid(),
    carPlate,
    requestDate,
    userID,
    sumbitDate: Date.now(),
    remarks,
  };

  bookingList.push(newBooking);
  writeFile(bookingList);
  return res.status(201).json(bookingList);
});

//Update single Booking by id
bookingRouter.put("/:id", (req, res) => {
  const { id } = req.params;
  const { requestDate, sumbitDate, userID, carPlate, remarks } = req.body;
  const foundBooking = bookingList.find((booking) => booking.id === id);

  if (!foundBooking) {
    return res.status(404).send("Booking not found!");
  }

  if (!carPlate || !requestDate) {
    return res.status(400).send("All fields are required");
  }

  const updatedBooking = {
    id: foundBooking.id,
    carPlate,
    requestDate,
    userID,
    sumbitDate: Date.now(),
    remarks,
  };

  console.log(updatedBooking);
  bookingList = bookingList.map((Booking) => {
    if (Booking.id === foundBooking.id) {
      return updatedBooking;
    } else {
      return Booking;
    }
  });

  writeFile(bookingList);

  return res.status(200).send(updatedBooking);
});

//Delete single Booking by id
bookingRouter.delete("/:id", (req, res) => {
  let { id } = req.params;
  const foundBooking = getBooking(id);

  if (!foundBooking) {
    return res.status(404).send("Booking not found!");
  }

  // userIndex = bookingList.indexOf(userFound);
  // console.log(userIndex);
  // console.log(bookingList);
  // updatedList = bookingList.splice(userIndex, 1);
  // console.log(updatedList);
  // writeFile(updatedList);
  // res.status(204).send("User deleted succesfully!");

  updatedList = bookingList.filter((booking) => booking.id !== foundBooking.id);
  writeFile(updatedList);
  return res.status(204).send();
});

module.exports = bookingRouter;
