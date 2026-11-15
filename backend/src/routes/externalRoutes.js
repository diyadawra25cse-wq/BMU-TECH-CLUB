
const express = require("express");
const router = express.Router();
const { getClubRepositoryStats } = require("../services/externalApiService");

// GET external repository stats from GitHub API
router.get("/github-stats", async (req, res) => {
  try {
    const result = await getClubRepositoryStats();
    if (result.live) {
      return res.status(200).json({
        success: true,
        ...result
      });
    }

    // Honest reporting when external network/API is unavailable
    return res.status(200).json({
      success: false,
      ...result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unexpected error during external API query."
    });
  }
});

module.exports = router;
