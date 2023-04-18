class Room {
  constructor(name, bookings = [], rate, discount) {
    this.name = name;
    this.bookings = bookings;
    this.rate = rate;
    this.discount = discount;
  }

  isOccupied(date) {
    let occupied = false;

    this.bookings.forEach((booking) => {
      if (
        date.getTime() >= booking.checkIn.getTime() &&
        date.getTime() <= booking.checkOut.getTime()
      ) {
        occupied = true;
      }
    });
    return occupied;
  }

  occupancyPercentage(startDate, endDate) {
    let totalDays = 0;
    let occupiedDays = 0;

    const startTimestamp = startDate.getTime();
    const endTimestamp = endDate.getTime();

    for (
      let currentTimestamp = startTimestamp;
      currentTimestamp <= endTimestamp;
      currentTimestamp += 86400000
    ) {
      const currentDate = new Date(currentTimestamp);
      totalDays++;
      if (this.isOccupied(currentDate)) {
        occupiedDays++;
      }
    }

    return (occupiedDays / totalDays) * 100;
  }

  static totalOccupancyPercentage(rooms, startDate, endDate) {
    let totalOccupiedDays = 0;
    let totalDays = 0;

    rooms.forEach((room) => {
      const startTimestamp = startDate.getTime();
      const endTimestamp = endDate.getTime();

      for (
        let currentTimestamp = startTimestamp;
        currentTimestamp <= endTimestamp;
        currentTimestamp += 86400000
      ) {
        const currentDate = new Date(currentTimestamp);
        totalDays++;

        if (room.isOccupied(currentDate)) {
          totalOccupiedDays++;
        }
      }
    });

    return (totalOccupiedDays / totalDays) * 100;
  }

  static availableRooms(rooms, startDate, endDate) {
    const availableRooms = [];

    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];
      let isOccupied = false;

      const startTimestamp = startDate.getTime();
      const endTimestamp = endDate.getTime();

      for (
        let currentTimestamp = startTimestamp;
        currentTimestamp <= endTimestamp;
        currentTimestamp += 86400000
      ) {
        const currentDate = new Date(currentTimestamp);
        if (room.isOccupied(currentDate)) {
          isOccupied = true;
          break;
        }
      }

      if (!isOccupied) {
        availableRooms.push(room);
      }
    }

    return availableRooms;
  }
}

class Booking {
  constructor(name, email, checkIn, checkOut, discount, room) {
    this.name = name;
    this.email = email;
    this.checkIn = checkIn;
    this.checkOut = checkOut;
    this.discount = discount;
    this.room = room;
  }

  fee() {
    let basePrice = this.room.pricePerNight * this.calculateNightDifference();

    let roomDiscount = (basePrice * this.room.discount) / 100;

    let bookingDiscount = (basePrice * this.discount) / 100;

    let totalFee = basePrice - roomDiscount - bookingDiscount;

    return totalFee;
  }

  calculateNightDifference() {
    // Assumes checkOut date is always greater than checkIn date
    const oneDay = 24 * 60;
    return Math.round(Math.abs((this.checkIn - this.checkOut) / oneDay));
  }
}

module.exports = {
  Room,
  Booking,
};
