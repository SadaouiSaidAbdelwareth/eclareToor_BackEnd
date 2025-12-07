import { bookingModel } from "../models/bookingModel.js";
import { tripModel } from "../models/tripModel.js";
import { findUserById } from "../models/userModel.js";

export const bookingService = {
  async create(user, data) {
    const { role, userId} = user;
    const { user_id = null , trip_id, passengers_adult, passengers_child = 0, passengers_baby = 0 } = data;

    if (!trip_id || passengers_adult == null) {
      throw new Error("Missing required fields");
    }

    // Vérifier que le trip existe
    const trip = await tripModel.getById(trip_id);
    if (!trip) throw new Error("Trip not found");

    let finalUserId;

    if (role === "admin") {

      // ADMIN → doit envoyer user_id
      if (!user_id) {
        throw new Error("Admin must provide user_id to create booking");
      }
      const userExists = await findUserById(user_id);
      if (!userExists) {
        throw new Error("User not found");
      }
      if(userExists.role === "admin" ){
        throw new Error("Admin must provide user_id to create booking");
      }

      finalUserId = user_id;

    } else {
      // USER → ne peut pas spécifier un autre user_id
      finalUserId = userId;

    }
    //verifier que l'utilisateur n'a pas déjà une réservation pour ce voyage
    const existingBookings = await bookingModel.getByUser(finalUserId);
    const hasExistingBooking = existingBookings.some(
      (booking) => booking.trip_id === trip_id
    );
    if (hasExistingBooking) {
      throw new Error("User already has a booking for this trip");
    }
    
    // Création
    return await bookingModel.create(
      finalUserId,
      trip_id,
      passengers_adult,
      passengers_child,
      passengers_baby
    );
  },

  // USER updates his own booking / ADMIN updates all
  async update(bookingId, user, data) {
    const booking = await bookingModel.getById(bookingId);
    if (!booking) throw new Error("Booking not found");
    console.log(data);
    // USER cannot modify someone else's booking
    if (user.role !== "admin" && booking.user_id !== user.userId)
      throw new Error("Forbidden");

    const fields = {};

    if (data.passengers_adult != null) fields.passengers_adult = data.passengers_adult;
    if (data.passengers_child != null) fields.passengers_child = data.passengers_child;
    if (data.passengers_baby != null) fields.passengers_baby = data.passengers_baby;
    
    //  USER CAN ONLY CANCEL HIS BOOKING
    if (data.status) {
      if (user.role !== "admin") {
        if (data.status !== "CANCELLED")
          throw new Error("User can only cancel the booking");
      } 
      fields.status = data.status; // Admin full permissions
      
    }
    console.log(fields);
    return await bookingModel.update(bookingId, fields);
  },

  async getByUser(user , data) {
    let userId
    if (user.role === "admin") {
      const { user_id = null } = data;
      if(!user_id){
        throw new Error("Admin must provide user_id to get bookings");
      }
      const userExists = await findUserById(user_id);
      if (!userExists) {
        throw new Error("User not found");
      }
      userId = user_id;
    } else {
      userId = user.userId;
    }
    return await bookingModel.getByUser(userId); 
  },

  async getAll() {
    return await bookingModel.getAll();
  },

  async delete(id) {
    return await bookingModel.delete(id);
  }
};
