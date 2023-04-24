class Room {
  name: string;
  bookings: Booking[];
  rate: number;
  discount: number;

  constructor(name: string, bookings: Booking[], rate: number, discount: number) {
    this.name = name;
    this.bookings = bookings;
    this.rate = rate;
    this.discount = discount;
  }

  isOccupied(date: Date): boolean {
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

  occupancyPercentage(startDate: Date, endDate: Date): number | false {
    let differenceDates = Math.abs(startDate.getTime() - endDate.getTime());
    let percentage = 0;

    if (startDate.getTime() >= endDate.getTime()) {
      return false;
    }

    this.bookings.forEach((booking) => {
      if (
        booking.checkIn.getTime() >= startDate.getTime() &&
        booking.checkOut.getTime() <= endDate.getTime()
      ) {
        percentage += Math.abs(
          booking.checkIn.getTime() - booking.checkOut.getTime()
        );
      }
    });

    return percentage === 0
      ? percentage
      : Number(((percentage * 100) / differenceDates).toFixed(0));
  }

  static totalOccupancyPercentage(rooms: Room[], startDate: Date, endDate: Date): number {
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

  static availableRooms(rooms: Room[], startDate: Date, endDate: Date): Room[] {
    const availableRooms: Room[] = [];

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
  name: string;
  email: string;
  checkIn: Date;
  checkOut: Date;
  discount: number;
  room: { pricePerNight: number; discount: number; };

  constructor(name: string, email: string, checkIn: Date, checkOut: Date, discount: number, room: { pricePerNight: number; discount: number; }) {
    this.name = name;
    this.email = email;
    this.checkIn = checkIn;
    this.checkOut = checkOut;
    this.discount = discount;
    this.room = room;
  }

  fee(): number {
    let basePrice = this.room.pricePerNight * this.calculateNightDifference();

    let roomDiscount = (basePrice * this.room.discount) / 100;

    let bookingDiscount = (basePrice * this.discount) / 100;

    let totalFee = basePrice - roomDiscount - bookingDiscount;

    return totalFee;
  }

  calculateNightDifference(): number {
    // Assumes checkOut date is always greater than checkIn date
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((this.checkIn.getTime() - this.checkOut.getTime()) / oneDay));
  }
}

module.exports = {
  Room,
  Booking,
};
