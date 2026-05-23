const express = require("express");

const router = express.Router();

router.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "Renovo backend",
    message: "Backend is running",
  });
});

router.get("/health", (_req, res) => {
  res.json({ ok: true });
});

module.exports = router;
