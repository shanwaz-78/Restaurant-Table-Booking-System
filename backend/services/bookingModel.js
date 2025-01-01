import openConnection from "../config/database.js";

const createBooking = async (bookingData) => {
  const conn = openConnection();
  try {
    const query = `
            INSERT INTO bookings 
            (customer_name, email, phone, date, time, guests) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
    const [result] = await conn.execute(query, [
      bookingData.customerName,
      bookingData.email,
      bookingData.phone,
      bookingData.date,
      bookingData.time,
      bookingData.guests,
    ]);
    return result.insertId;
  } finally {
    if (conn) await conn.end();
  }
};

const getAvailableSlots = async (date) => {
  const conn = openConnection();
  try {
    const query = `
            SELECT 
                ts.time,
                ts.capacity,
                COALESCE(SUM(b.guests), 0) as booked_seats
            FROM time_slots ts
            LEFT JOIN bookings b ON ts.time = b.time 
                AND b.date = ? 
                AND b.status = 'confirmed'
            GROUP BY ts.time
            ORDER BY ts.time
        `;
    const [rows] = await conn.execute(query, [date]);
    return rows;
  } finally {
    if (conn) await conn.end();
  }
};

const getBookingById = async (id) => {
  const conn = openConnection();
  try {
    const [rows] = await conn.execute("SELECT * FROM bookings WHERE id = ?", [
      id,
    ]);
    return rows[0];
  } finally {
    if (conn) await conn.end();
  }
};

const updateBookingStatus = async (id, status) => {
  const conn = openConnection();
  try {
    const [result] = await conn.execute(
      "UPDATE bookings SET status = ? WHERE id = ?",
      [status, id]
    );
    return result.affectedRows > 0;
  } finally {
    if (conn) await conn.end();
  }
};

export default {
  createBooking,
  getAvailableSlots,
  getBookingById,
  updateBookingStatus,
};
