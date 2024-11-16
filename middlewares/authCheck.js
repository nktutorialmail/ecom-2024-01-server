const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma")


exports.authCheck = async (req, res, next) => {
  try {
    const headersToken = req.headers.authorization;
    
    if (!headersToken) {
      return res.status(401).send({ message: "No Token Authorization"})
    }

    const token = headersToken.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT_LOGIN)
    
    const user = await prisma.user.findFirst({
      where: {
        email: decoded.email
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
    });

    if (!user.enabled) {
      return res.status(400).send({ message: "This account cannot accessed"})
    }

    req.user = user;
    next();
  } catch(err) {
    console.log(err);
    return res.status(500).json({ message: "Invalid token!!"})
  }
}

exports.adminCheck = async (req, res, next) => {
  try {
    const { email } = req.user
    const adminUser = await prisma.user.findFirst({
      where: {
        email: email
      }
    })

    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).send({ message: "Access Denied: Admin Only"})
    } 

    next();
  } catch(err) {
    console.log(err);
    return res.status(500).json({ message: "Admin accessed denied!!"})
  }
}