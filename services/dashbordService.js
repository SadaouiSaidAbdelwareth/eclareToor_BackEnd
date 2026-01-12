import { dashbordModel } from "../models/dashbordModel.js";

export const dashboardService = {
  async getDashboard() {
    return {
      kpis: await dashbordModel.getGlobalKpis(),
      usersPerMonth: await dashbordModel.usersPerMonth(),
      bookingsPerMonth: await dashbordModel.bookingsPerMonth(),
      revenuePerMonth: await dashbordModel.revenuePerMonth(),
      tripsByType: await dashbordModel.tripsByType(),
      bookingsByStatus: await dashbordModel.bookingsByStatus(),
      revenueByTrip: await dashbordModel.revenueByTrip(),
      topDestinations: await dashbordModel.topDestinations(),
      conversion: await dashbordModel.conversionRate()
    };
  }
};
