const { Room, Booking } = require("./index");

describe("Room", () => {
  // Test case for property initialization
  test("should correctly initialize properties", () => {
    const room1 = new Room("Room 101", 5, 100, 0.2);
    expect(room1.name).toEqual("Room 101");
    expect(room1.bookings).toEqual(5);
    expect(room1.rate).toEqual(100);
    expect(room1.discount).toEqual(0.2);
  });

  // Test case for property initialization with incorrect values
  test("should not initialize properties with incorrect values", () => {
    const room2 = new Room(null, undefined, "invalid", "invalid");
    expect(room2.name).toBeNull();
    expect(room2.bookings).toBeUndefined();
    expect(room2.rate).toBeNaN();
    expect(room2.discount).toBeNaN();
  });

  // Test case for checking proper types of properties
  test("should have proper types for properties", () => {
    const room3 = new Room("Room 102", [], 150.5, 0.3);
    expect(typeof room3.name).toEqual("string");
    expect(Array.isArray(room3.bookings)).toBe(true);
    expect(room3.bookings.every((booking) => booking instanceof Booking)).toBe(
      true
    );
    expect(typeof room3.rate).toEqual("number");
    expect(typeof room3.discount).toEqual("number");
  });
});

describe("isOccupied", () => {
  let room;

  beforeEach(() => {
    // Create a new Room object before each test
    room = new Room("Test Room", [], 100, 10);
  });

  // Test case for checking if a room is occupied on a given date
  test("should be occupied on a given date and return truthy value", () => {
    const booking = {
      checkIn: new Date("2023-04-16"),
      checkOut: new Date("2023-04-18"),
    };
    room.bookings.push(booking);
    const occupied = room.isOccupied(new Date("2023-04-17"));

    // Expect the result to be truthy
    expect(occupied).toBeTruthy();
  });

  // Test case for checking if a room is not occupied on a given date
  test("should not be occupied on a given date and return falsy value", () => {
    const booking = {
      checkIn: new Date("2023-04-18"),
      checkOut: new Date("2023-04-20"),
    };
    room.bookings.push(booking);

    const occupied = room.isOccupied(new Date("2023-04-17"));

    // Expect the result to be falsy
    expect(occupied).toBeFalsy();
  });

  // Test case for checking if a room is not occupied when there are no bookings
  test("should not be occupied when there are no bookings and return falsy value", () => {
    const occupied = room.isOccupied(new Date("2023-04-17"));

    // Expect the result to be falsy
    expect(occupied).toBeFalsy();
  });
});

describe("occupancyPercentage", () => {
  const room = new Room();
  it("calculates correct occupancy percentage for a range with no bookings", () => {
    const startDate = new Date("2023-04-01");
    const endDate = new Date("2023-04-10");
    const occupancyPercentage = room.occupancyPercentage(startDate, endDate);
    expect(occupancyPercentage).toBe(0);
  });

  it("calculates correct occupancy percentage for a range with partial bookings", () => {
    const startDate = new Date("2023-04-19");
    const endDate = new Date("2023-04-28");
    const occupancyPercentage = room.occupancyPercentage(startDate, endDate);
    expect(occupancyPercentage).toBe(50);
  });

  it("calculates correct occupancy percentage for a range with complete bookings", () => {
    const startDate = new Date("2023-04-15");
    const endDate = new Date("2023-04-30");
    const occupancyPercentage = room.occupancyPercentage(startDate, endDate);
    expect(occupancyPercentage).toBe(100);
  });

  // New test case for complete bookings
  it("calculates correct occupancy percentage for a range with complete bookings", () => {
    const startDate = new Date("2023-04-01");
    const endDate = new Date("2023-04-30");

    // Add complete bookings for the entire range
    room.bookings.push({ checkIn: startDate, checkOut: endDate });
    const occupancyPercentage = room.occupancyPercentage(startDate, endDate);
    expect(occupancyPercentage).toBe(100);
  });

  // New test case for checking if the room is occupied on a given date (should be truthy)
  it("should be occupied on a given date and return truthy value", () => {
    const booking = {
      checkIn: new Date("2023-04-16"),
      checkOut: new Date("2023-04-18"),
    };
    room.bookings.push(booking);
    const occupied = room.isOccupied(new Date("2023-04-17"));

    // Expect the result to be truthy
    expect(occupied).toBeTruthy();
  });

  // New test case for checking if the room is occupied on a given date (should be falsy)
  it("should not be occupied on a given date and return falsy value", () => {
    const booking = {
      checkIn: new Date("2023-04-18"),
      checkOut: new Date("2023-04-20"),
    };
    room.bookings.push(booking);

    const occupied = room.isOccupied(new Date("2023-04-17"));

    // Expect the result to be falsy
    expect(occupied).toBeFalsy();
  });

  // New test case for checking if the room is occupied on a given date (should be falsy)
  it("should not be occupied when there are no bookings and return falsy value", () => {
    const occupied = room.isOccupied(new Date("2023-04-17"));

    // Expect the result to be falsy
    expect(occupied).toBeFalsy();
  });
});

describe("totalOccupancyPercentage", () => {
  test("totalOccupancyPercentage calculates correctly for a single room", () => {
    const room = new Room("Room 1", [
      { checkIn: new Date("2023-04-10"), checkOut: new Date("2023-04-14") },
      { checkIn: new Date("2023-04-18"), checkOut: new Date("2023-04-20") },
    ]);

    // Calculate total occupancy percentage for the date range: 2023-04-01 to 2023-04-30
    const startDate = new Date("2023-04-01");
    const endDate = new Date("2023-04-30");
    const occupancyPercentage = Room.totalOccupancyPercentage(
      [room],
      startDate,
      endDate
    );

    // Expected result: (4 + 2) / 30 * 100 = 20
    expect(occupancyPercentage).toEqual(20);
  });

  test("totalOccupancyPercentage calculates correctly for multiple rooms", () => {
    // Create multiple rooms with bookings
    const room1 = new Room("Room 1", [
      { checkIn: new Date("2023-04-10"), checkOut: new Date("2023-04-14") },
    ]);
    const room2 = new Room("Room 2", [
      { checkIn: new Date("2023-04-15"), checkOut: new Date("2023-04-17") },
    ]);

    // Calculate total occupancy percentage for the date range: 2023-04-01 to 2023-04-30
    const startDate = new Date("2023-04-01");
    const endDate = new Date("2023-04-30");
    const occupancyPercentage = Room.totalOccupancyPercentage(
      [room1, room2],
      startDate,
      endDate
    );

    // Expected result: (4 + 3) / 30 * 100 = 23.33 (rounded to 2 decimal places)
    expect(occupancyPercentage).toBeCloseTo(23.33, 2);
  });
});

describe("availableRooms", () => {
  const room1 = new Room("Room 1", [], 100, 0.1);
  const room2 = new Room("Room 2", [], 150, 0.2);
  const room3 = new Room("Room 3", [], 200, 0.3);
  const rooms = [room1, room2, room3];

  it("returns all rooms as available when no rooms are occupied", () => {
    const startDate = new Date("2023-04-19");
    const endDate = new Date("2023-04-28");

    const availableRooms = Room.availableRooms(rooms, startDate, endDate);

    expect(availableRooms).toEqual(rooms);
  });

  it("returns only unoccupied rooms when some rooms are occupied", () => {
    const startDate = new Date("2023-04-15");
    const endDate = new Date("2023-04-30");

    // Occupying room1 for the entire duration
    room1.bookings.push({ checkIn: startDate, checkOut: endDate });

    const availableRooms = Room.availableRooms(rooms, startDate, endDate);

    expect(availableRooms).toEqual([room2, room3]);
  });

  it("returns an empty array when all rooms are occupied", () => {
    const startDate = new Date("2023-04-15");
    const endDate = new Date("2023-04-30");

    // Occupying all rooms for the entire duration
    room1.bookings.push({ checkIn: startDate, checkOut: endDate });
    room2.bookings.push({ checkIn: startDate, checkOut: endDate });
    room3.bookings.push({ checkIn: startDate, checkOut: endDate });

    const availableRooms = Room.availableRooms(rooms, startDate, endDate);

    expect(availableRooms).toEqual([]);
  });
});

//-----------------------------------------------------------------------------
// Tests for Booking

describe("Booking", () => {
  let booking;
  let room;

  beforeEach(() => {
    // Create a new Booking object and a mock Room object before each test
    room = new Room();
    booking = new Booking(
      "John Doe",
      "pacor@example.com",
      new Date("2023-04-20"),
      new Date("2023-04-25"),
      10,
      room
    );
  });

  afterEach(() => {
    // Clean up after each test
    booking = null;
    room = null;
  });

  test("All parameters are of proper type", () => {
    expect(booking.name).toBeDefined();
    expect(typeof booking.name).toBe("string");
    expect(booking.email).toBeDefined();
    expect(typeof booking.email).toBe("string");
    expect(booking.checkIn).toBeInstanceOf(Date);
    expect(booking.checkOut).toBeInstanceOf(Date);
    expect(typeof booking.discount).toBe("number");
    expect(booking.room).toBeInstanceOf(Room);
  });

  test("Returns the fee, including discounts on room and booking", () => {
    // Calculate expected fee
    let nights = booking.calculateNightDifference();
    let basePrice = room.pricePerNight * nights;
    let roomDiscount = (basePrice * room.discount) / 100;
    let bookingDiscount = (basePrice * booking.discount) / 100;
    let expectedFee = basePrice - roomDiscount - bookingDiscount;

    // Assert that fee() returns the expected fee
    expect(booking.fee()).toBe(expectedFee);
  });
});
