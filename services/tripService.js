import { tripModel } from "../models/tripModel.js";
import { fileService } from "./fileService.js";

export const tripService = {

  async create(data, files) {
    try {
      const {
        type, title, description,
        start_date, end_date, base_price,
        equipment_list, destination_wilaya, destination_country,
        omra_category,
        options, promotion        // 🆕
      } = data;

      // Required fields
      if (!type || !title || !description || !start_date || !end_date || !base_price) {
        throw new Error("Missing required fields");
      }

      // Religious trip rules
      if (type === "religieuse" && !omra_category) {
        throw new Error("Omra category is required for religious trips");
      }

      if (type !== "religieuse") {
        data.omra_category = null;
      }
      //   console.log("Saved images:", type);
      if (promotion !== undefined) {
        const p = Number(promotion);
        if (isNaN(p) || p < 0 || p > 100) {
          throw new Error("Promotion must be between 0 and 100");
        }
      }

      // save images
     const images = fileService.saveImages("trips", files);
      return await tripModel.create({
        ...data,
        options: options || null,
        promotion: promotion || 0,
        images
      });

    } catch (err) {
      throw new Error("Error creating trip: " + err.message);
    }
  },

  async getAll() {
    return await tripModel.getAll();
  },

  async getById(id) {
    try {
      const trip = await tripModel.getById(id);
      if (!trip) throw new Error("Trip not found");
      return trip;
    } catch (e) {
      throw new Error(e.code === "22P02" ? "Invalid trip ID" : e.message);
    }
  },

  async updateInfo(id, data) {
    try {
      const trip = await this.getById(id);

      return await tripModel.updateInfo(id, {
        ...trip,
        ...data
      });

    } catch (err) {
      throw new Error("Error updating trip: " + err.message);
    }
  },

  async addImages(id, files) {
    const trip = await this.getById(id);
    const newImgs = fileService.saveImages("trips", files);

    const finalImgs = [...(trip.images || []), ...newImgs];

    return await tripModel.updateImages(id, finalImgs);
  },

  async replaceImages(id, namesToRemove, files) {
    const trip = await this.getById(id);
    let images = [...trip.images];
    console.log(typeof namesToRemove);
    if (typeof namesToRemove === "string") namesToRemove = [namesToRemove];
    console.log(typeof namesToRemove);
    console.log(namesToRemove);

    namesToRemove.forEach(name => {
      const index = images.findIndex(img => img.endsWith(name));
      if (index !== -1) {
        fileService.deleteImage(images[index]);
        images.splice(index, 1);
      }
    });

    const newImgs = fileService.saveImages("trips", files);
    images.push(...newImgs);

    return await tripModel.updateImages(id, images);
  },

  async deleteManyImages(id, names) {
    const trip = await this.getById(id);
    let images = [...trip.images];

    if (typeof names === "string") names = [names];

    names.forEach(name => {
      const index = images.findIndex(img => img.endsWith(name));
      if (index !== -1) {
        fileService.deleteImage(images[index]);
        images.splice(index, 1);
      }
    });

    return await tripModel.updateImages(id, images);
  },

  async deleteTrip(id) {
    try {
      const trip = await this.getById(id);
     (trip.images || []).forEach(img => fileService.deleteImage(img));
     await tripModel.delete(id);
      // await tripItineraryModel.deleteByTripId(id);
    } catch (err) {
      throw new Error("Error deleting trip : " + err.message);
    }
  }
};
