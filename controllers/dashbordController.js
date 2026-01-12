import { dashboardService } from "../services/dashbordService.js";

export const dashboardController = {
  async dashboard(req, res) {
    try {
      const data = await dashboardService.getDashboard();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
