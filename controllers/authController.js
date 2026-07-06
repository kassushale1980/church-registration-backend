// Simple Admin Login (no database)
export const loginAdmin = (req, res) => {
  const { username, password } = req.body;

  // 🔐 change these anytime
  const ADMIN_USER = "admin";
  const ADMIN_PASS = "1234";

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.json({
      message: "Login successful",
      token: "admin-token-123",
    });
  }

  return res.status(401).json({
    message: "Invalid credentials",
  });
};