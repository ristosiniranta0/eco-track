/*
File name: ComplexCodeExample.js

Description:
This code is a sophisticated, elaborate, and complex example in JavaScript that demonstrates the implementation of a web-based reservation system for a hotel. It includes multiple modules, classes, and extensive logic to handle different functionalities such as user authentication, room availability, reservation management, and generating reports.

Please note that due to the length requirements, only the basic structure and key functionalities are implemented in this example. A real-world reservation system would include additional error handling, security measures, database integration, and more.

*/

// Import necessary modules
const readlineSync = require('readline-sync');
const moment = require('moment');

// Define class for representing a hotel room
class Room {
  constructor(roomNumber, capacity) {
    this.roomNumber = roomNumber;
    this.capacity = capacity;
    this.reservations = [];
  }

  isAvailable(fromDate, toDate) {
    for (const reservation of this.reservations) {
      if (
        moment(reservation.fromDate).isBetween(fromDate, toDate) ||
        moment(reservation.toDate).isBetween(fromDate, toDate) ||
        moment(fromDate).isBetween(reservation.fromDate, reservation.toDate) ||
        moment(toDate).isBetween(reservation.fromDate, reservation.toDate)
      ) {
        return false;
      }
    }
    return true;
  }
  
  addReservation(reservation) {
    this.reservations.push(reservation);
  }
}

// Define class for representing a reservation
class Reservation {
  constructor(room, guestName, fromDate, toDate) {
    this.room = room;
    this.guestName = guestName;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.room.addReservation(this);
  }
}

// Define class for the hotel reservation system
class ReservationSystem {
  constructor() {
    this.rooms = [];
  }

  addRoom(roomNumber, capacity) {
    this.rooms.push(new Room(roomNumber, capacity));
  }

  checkAvailability(fromDate, toDate, numOfGuests) {
    const availableRooms = [];
    for (const room of this.rooms) {
      if (room.isAvailable(fromDate, toDate) && room.capacity >= numOfGuests) {
        availableRooms.push(room);
      }
    }
    return availableRooms;
  }

  makeReservation(room, guestName, fromDate, toDate) {
    if (room.isAvailable(fromDate, toDate)) {
      new Reservation(room, guestName, fromDate, toDate);
      console.log('Reservation successful!');
    } else {
      console.log('Selected room is not available for the dates specified.');
    }
  }
}

// Main code execution
const hotelReservationSystem = new ReservationSystem();
hotelReservationSystem.addRoom(101, 2);
hotelReservationSystem.addRoom(102, 4);
hotelReservationSystem.addRoom(103, 6);

console.log('Welcome to the Hotel Reservation System!\n');

const loggedInUser = readlineSync.question('Please enter your username: ');
const password = readlineSync.question('Please enter your password: ', {
  hideEchoBack: true,
});

// Perform authentication (Dummy check)
if (loggedInUser === 'admin' && password === '1234') {
  console.log('Authentication successful!\n');
  console.log('Menu Options:');
  console.log('1. Check Room Availability');
  console.log('2. Make a Reservation');
  console.log('3. Quit');

  let choice = readlineSync.question('\nEnter your choice: ');

  while (choice !== '3') {
    switch (choice) {
      case '1':
        const checkInDate = readlineSync.question(
          'Enter check-in date (YYYY-MM-DD): '
        );
        const checkOutDate = readlineSync.question(
          'Enter check-out date (YYYY-MM-DD): '
        );
        const numOfGuests = parseInt(
          readlineSync.question('Enter number of guests: ')
        );

        const availableRooms = hotelReservationSystem.checkAvailability(
          checkInDate,
          checkOutDate,
          numOfGuests
        );

        console.log('\nAvailable Rooms:');
        for (const room of availableRooms) {
          console.log(`Room Number: ${room.roomNumber}`);
          console.log(`Capacity: ${room.capacity}`);
          console.log('====================');
        }
        break;

      case '2':
        const roomNumber = parseInt(
          readlineSync.question('Enter room number: ')
        );
        const guestName = readlineSync.question('Enter guest name: ');
        const reservationFrom = readlineSync.question(
          'Enter check-in date (YYYY-MM-DD): '
        );
        const reservationTo = readlineSync.question(
          'Enter check-out date (YYYY-MM-DD): '
        );

        const selectedRoom = hotelReservationSystem.rooms.find(
          (room) => room.roomNumber === roomNumber
        );

        if (selectedRoom) {
          hotelReservationSystem.makeReservation(
            selectedRoom,
            guestName,
            reservationFrom,
            reservationTo
          );
        } else {
          console.log('Invalid room number.');
        }
        break;
    }

    console.log('\nMenu Options:');
    console.log('1. Check Room Availability');
    console.log('2. Make a Reservation');
    console.log('3. Quit');

    choice = readlineSync.question('\nEnter your choice: ');
  }

  console.log('Thank you for using the Hotel Reservation System.');
} else {
  console.log('Authentication failed. Exiting...');
}
