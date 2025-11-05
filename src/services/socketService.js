import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket) return;

    this.socket = io('http://localhost:5000', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      forceNew: true
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connecté');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket déconnecté');
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Écouter les nouveaux messages
  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  // Écouter les nouvelles notifications
  onNewNotification(callback) {
    if (this.socket) {
      this.socket.on('new_notification', callback);
    }
  }

  // Écouter les nouvelles réservations
  onNewReservation(callback) {
    if (this.socket) {
      this.socket.on('new_reservation', callback);
    }
  }

  // Écouter les mises à jour de réservation
  onReservationUpdate(callback) {
    if (this.socket) {
      this.socket.on('reservation_updated', callback);
    }
  }

  // Rejoindre une room utilisateur
  joinUserRoom(userId) {
    if (this.socket) {
      this.socket.emit('join_user_room', userId);
    }
  }

  // Nettoyer les listeners
  off(event) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

export default new SocketService();