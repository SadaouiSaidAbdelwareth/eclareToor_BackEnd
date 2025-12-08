import { pool } from '../config/database.js';

export const requestResponseModel = {
  create: async (requestId, adminId, offer) => {
    const result = await pool.query(
      `INSERT INTO request_responses (request_id, admin_id, offer)
       VALUES ($1,$2,$3) RETURNING *`,
      [requestId, adminId, offer]
    );
    return result.rows[0];
  },

  getById: async (id) => {
    const result = await pool.query(`SELECT * FROM request_responses WHERE id=$1`, [id]);
    return result.rows[0];
  },

  getAll: async () => {
    const result = await pool.query(`SELECT * FROM request_responses ORDER BY created_at DESC`);
    return result.rows;
  },

  deleteMany: async (ids) => {
    const result = await pool.query(
      `DELETE FROM request_responses WHERE id = ANY($1::uuid[]) RETURNING *`,
      [ids]
    );
    return result.rows;
  },

  update: async (id, fields) => {
    const sets = Object.keys(fields).map((key, i) => `${key}=$${i+1}`).join(',');
    const values = Object.values(fields);
    const result = await pool.query(
      `UPDATE request_responses SET ${sets} WHERE id=$${values.length+1} RETURNING *`,
      [...values, id]
    );
    return result.rows[0];
  }
};
