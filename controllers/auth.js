const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1 Validate body
    if (!email) {
      return res.status(400).json({ message: "Email is required!!" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required!!" });
    }

    // step 2 Check email & password in DB already
    const user = await prisma.user.findFirst({
      where: {
        email: email
      }
    });

    if (user) {
      return res.status(400).json({ message: "Email already exits!!" });
    }

    //  step 3 HashPassword
    const hashPassword = await bcrypt.hash(password, 10);

    // step 4 register
    await prisma.user.create({
      data: {
        email: email,
        password: hashPassword
      }
    });
   
    return res.json({ message: "Register success" });
  } catch(err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1 Check email
    const user = await prisma.user.findFirst({
      where: {
        email: email
      }
    });

    if (!user || !user.enabled) {
      return res.status(400).json({ message: "User Not found or not Enabled"});
    }

    // Step 2 Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Password Invalid!!" });
    }

    // step 3 Check payload
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    }

    // step 4 Generate Token
    jwt.sign(payload, process.env.SECRET_KEY_JWT_LOGIN, { expiresIn: "1d" }, (error, token) => {
      if (error) {
        return res.status(400).json({ message: "Login Error, controllers/auth/login" });
      }
      return res.json({ message: "Login success", payload, token });
    });
  } catch(err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
}

exports.currentUser = async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: req.user.email
      },
      select: {
        id: true,
        email: true,
        name: true,
        picture: true,
        role: true,
        enabled: true,
        address: true,
        createdAt: true,
        updatedAt: true,
        Orders: true,
        Carts: true
      }     
    })

    return res.json({ message: "success", user });
  } catch(error) {
    console.log(error);
    res.status(500).json({ message: "Server Error, controller/auth/currentUser"});
  }
}