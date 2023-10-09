const express = require("express");
const passport = require("passport");
const router = express.Router();

//@description  Auth with Google
//@route        GET /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

//@description  Google Auth Callback
//@route        GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

//@desc Logout User
router.get("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.redirect("/");
  });
});
module.exports = router;
