const express = require("express");
const router = express.Router();

const { TOPICS_BY_CATEGORY } = require("../constants/topics");

// GET topics
router.get("/topics", (req, res) => {
  res.json(TOPICS_BY_CATEGORY);
});

module.exports = router;