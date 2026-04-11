export const apiShield = (req, res, next) => {
  try {
    const data = JSON.stringify(req.body).toLowerCase();

    const patterns = [
      "<script>",
      "select ",
      "insert ",
      "delete ",
      "drop ",
      "--",
      " or ",
      " and "
    ];

    const isAttack = patterns.some((p) => data.includes(p));

    if (isAttack) {
      return res.status(403).json({
        success: false,
        message: "Suspicious request blocked 🚨",
      });
    }

    next();
  } catch (err) {
    next();
  }
};