import { pool } from "../config/database.js";

export const dashbordModel = {

  // KPI globaux
  async getGlobalKpis() {
    const { rows } = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM users WHERE role='user') AS total_users,
        (SELECT COUNT(*) FROM trips) AS total_trips,
        (SELECT COUNT(*) FROM bookings) AS total_bookings,
        (SELECT COUNT(*) FROM bookings WHERE status='PENDING') AS pending_bookings,
        (SELECT COUNT(*) FROM bookings WHERE status='CONFIRMED') AS confirmed_bookings,
        (SELECT COUNT(*) FROM bookings WHERE status='PAID') AS paid_bookings,
        (SELECT COUNT(*) FROM bookings WHERE status='CANCELLED') AS cancelled_bookings,
        (SELECT COALESCE(SUM(prix_vrai_paye),0) FROM bookings WHERE status='PAID') AS total_revenue
    `);
    return rows[0];
  },

  // Utilisateurs par mois
  async usersPerMonth() {
    const { rows } = await pool.query(`
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM') AS month,
        COUNT(*) AS total
      FROM users
      WHERE role='user'
      GROUP BY month
      ORDER BY month;
    `);
    return rows;
  },

  // Réservations par mois
  async bookingsPerMonth() {
    const { rows } = await pool.query(`
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM') AS month,
        COUNT(*) AS total
      FROM bookings
      GROUP BY month
      ORDER BY month;
    `);
    return rows;
  },

  // Revenu par mois
  async revenuePerMonth() {
    const { rows } = await pool.query(`
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM') AS month,
        COALESCE(SUM(prix_vrai_paye),0) AS revenue
      FROM bookings
      WHERE status='PAID'
      GROUP BY month
      ORDER BY month;
    `);
    return rows;
  },

  // Trips par type
  async tripsByType() {
    const { rows } = await pool.query(`
      SELECT type, COUNT(*) AS total
      FROM trips
      GROUP BY type;
    `);
    return rows;
  },

  // Réservations par status
  async bookingsByStatus() {
    const { rows } = await pool.query(`
      SELECT status, COUNT(*) AS total
      FROM bookings
      GROUP BY status;
    `);
    return rows;
  },

  // Revenue par trip
  async revenueByTrip() {
    const { rows } = await pool.query(`
      SELECT 
        t.title,
        SUM(b.prix_vrai_paye) AS revenue
      FROM bookings b
      JOIN trips t ON b.trip_id = t.id
      WHERE b.status='PAID'
      GROUP BY t.title
      ORDER BY revenue DESC;
    `);
    return rows;
  },

  // Top destinations
  async topDestinations() {
    const { rows } = await pool.query(`
      SELECT 
        t.destination_country,
        COUNT(b.id) AS bookings
      FROM bookings b
      JOIN trips t ON b.trip_id = t.id
      GROUP BY t.destination_country
      ORDER BY bookings DESC
      LIMIT 5;
    `);
    return rows;
  },

  // Taux de conversion: Le pourcentage de réservations qui ont réellement été payées.
  async conversionRate() {
    const { rows } = await pool.query(`
      SELECT
        ROUND(
          (SELECT COUNT(*) FROM bookings WHERE status='PAID')::decimal /
          NULLIF((SELECT COUNT(*) FROM bookings),0) * 100
        ,2) AS conversion_rate
    `);
    return rows[0];
  }
};
