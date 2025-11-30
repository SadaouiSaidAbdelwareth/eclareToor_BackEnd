import { query } from '../config/database.js';

export class Notification {
  // Créer une notification
  static async create(notificationData) {
    const {
      user_id,
      type,
      title,
      message,
      action_url = null,
      metadata = null,
      expires_at = null
    } = notificationData;

    const result = await query(
      `INSERT INTO notifications 
       (user_id, type, title, message, action_url, metadata, expires_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [user_id, type, title, message, action_url, metadata, expires_at]
    );
    
    return result.rows[0];
  }

  // Trouver par ID
  static async findById(id) {
    const result = await query(
      'SELECT * FROM notifications WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  // Trouver par utilisateur
  static async findByUserId(userId, options = {}) {
    const {
      limit = 50,
      offset = 0,
      unreadOnly = false,
      includeExpired = false
    } = options;

    let sql = `
      SELECT * FROM notifications 
      WHERE user_id = $1
    `;
    
    const params = [userId];
    let paramCount = 1;

    if (unreadOnly) {
      paramCount++;
      sql += ` AND is_read = $${paramCount}`;
      params.push(false);
    }

    if (!includeExpired) {
      sql += ` AND (expires_at IS NULL OR expires_at > NOW())`;
    }

    sql += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);
 console.log('📊 Requête finale:', sql);
    console.log('🔢 Paramètres:', params);
        const result = await query(sql, params);
    return result.rows;
  }

  // Compter les non lues
  static async countUnread(userId) {
    const result = await query(
      `SELECT COUNT(*) as count 
       FROM notifications 
       WHERE user_id = $1 AND is_read = false 
       AND (expires_at IS NULL OR expires_at > NOW())`,
      [userId]
    );
    return parseInt(result.rows[0].count);
  }

  // Marquer comme lue
  static async markAsRead(id, userId) {
    const result = await query(
      `UPDATE notifications 
       SET is_read = true 
       WHERE id = $1 AND user_id = $2 
       RETURNING *`,
      [id, userId]
    );
    return result.rows[0];
  }

  static async markAllAsRead(userId) {
    const result = await query(
      `UPDATE notifications 
      SET is_read = true 
      WHERE user_id = $1 AND is_read = false 
      RETURNING *`,
      [userId]
    );
    result.rowCount; // Retourne le nombre de lignes modifiées
  }

  // Supprimer les notifications expirées
  static async cleanupExpired() {
    const result = await query(
      'DELETE FROM notifications WHERE expires_at < NOW() RETURNING COUNT(*) as deleted_count'
    );
    return parseInt(result.rows[0].deleted_count);
  }

  // Supprimer une notification
  static async delete(id, userId) {
    const result = await query(
      'DELETE FROM notifications WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );
    return result.rows[0];
  }
}