const router = require("express").Router();
const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
 const hashedPassword = await bcrypt.hash(req.body.password, 10);

 const user = await User.create({
  name: req.body.name,
  email: req.body.email,
  password: hashedPassword
 });

 res.json(user);
});

router.post("/login", async (req, res) => {
 const user = await User.findOne({ email: req.body.email });

 if (!user) return res.status(400).send("User not found");

 const valid = await bcrypt.compare(req.body.password, user.password);

 if (!valid) return res.status(400).send("Wrong password");

 const token = jwt.sign({ id: user._id }, "secret");

 res.json({ token });
});

module.exports = router;