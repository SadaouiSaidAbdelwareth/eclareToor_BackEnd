import { NotificationService } from '../services/notificationServer.js';

// === ROUTES PUBLIQUES (pour user connecté) ===

// Récupérer mes notifications
export const getMyNotifications = async (req, res) => {
  try {
    const { 
      limit = 50, 
      offset = 0, 
      unread_only = false,
      include_expired = false 
    } = req.query;

    const options = {
      limit: parseInt(limit),
      offset: parseInt(offset),
      unreadOnly: unread_only === 'true',
      includeExpired: include_expired === 'true'
    };
   
    const notifications = await NotificationService.getUserNotifications(
      req.user.userId, 
      options
    );
    
    const unreadCount = await NotificationService.getUnreadCount(req.user.userId);
    
    res.json({
      success: true,
      data: {
        notifications,
        unread_count: unreadCount,
        pagination: {
          limit: options.limit,
          offset: options.offset,
          total: notifications.length
        }
      }
    });
  } catch (error) {
    console.error('Erreur récupération notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des notifications'
    });
  }
};

// Récupérer une notification spécifique
export const getNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notifications = await NotificationService.getUserNotifications(
      req.user.userId, 
      { limit: 1, includeExpired: true }
    );
    
    const notification = notifications.find(n => n.id === notificationId);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification non trouvée'
      });
    }
    
    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Erreur récupération notification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la notification'
    });
  }
};

// Marquer comme lue
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await NotificationService.markAsRead(notificationId, req.user.userId);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification non trouvée'
      });
    }
    
    res.json({
      success: true,
      message: 'Notification marquée comme lue',
      data: notification
    });
  } catch (error) {
    console.error('Erreur marquage notification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du marquage de la notification'
    });
  }
};

// Marquer toutes comme lues
export const markAllAsRead = async (req, res) => {
  try {
    const updatedCount = await NotificationService.markAllAsRead(req.user.userId);
    
    res.json({
      success: true,
      message: `${updatedCount} notifications marquées comme lues`,
      data: { updated_count: updatedCount }
    });
  } catch (error) {
    console.error('Erreur marquage toutes notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du marquage des notifications'
    });
  }
};

// Supprimer une notification
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await NotificationService.deleteNotification(notificationId, req.user.userId);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification non trouvée'
      });
    }
    
    res.json({
      success: true,
      message: 'Notification supprimée',
      data: notification
    });
  } catch (error) {
    console.error('Erreur suppression notification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la notification'
    });
  }
};

// Récupérer le compteur de notifications non lues
export const getUnreadCount = async (req, res) => {
  try {
    const count = await NotificationService.getUnreadCount(req.user.userId);
    
    res.json({
      success: true,
      data: { unread_count: count }
    });
  } catch (error) {
    console.error('Erreur compteur notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du compteur'
    });
  }
};