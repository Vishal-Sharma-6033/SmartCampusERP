export const apiShield = (req, res, next) => {
  const data =
    JSON.stringify(req.body) +
    JSON.stringify(req.query) +
    JSON.stringify(req.params);

  const patterns = [
    "$",
    "{",
    "}",
    "<script>",
    "SELECT",
    "INSERT",
    "DELETE",
    "DROP",
    "--",
  ];

  const isAttack = patterns.some((p) =>
    data.toLowerCase().includes(p.toLowerCase())
  );

  if (isAttack) {
    return res.status(403).json({
      success: false,
      message: "Suspicious request blocked 🚨",
    });
  }

  next();
};