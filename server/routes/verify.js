// Import libraries
const jwt = require("jsonwebtoken");

app.get("/verify/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET);
    const email = decoded.email;

    // Update the user's email verification status in the database
    await db.verifyEmail(email);

    res.send("Email successfully verified");
  } catch (error) {
    res.status(400).send("Invalid or expired email verification token");
  }
});
