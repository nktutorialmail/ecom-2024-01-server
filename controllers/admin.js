const prisma = require("../config/prisma");

exports.changeOrderStatus = async (req, res) => {
  try {
    const { orderId, orderStatus } = req.body;

    const orders = await prisma.order.update({
      where: {
        id: parseInt(orderId)
      },
      data: {
        orderStatus: orderStatus
      }
    })
    
    return res.json({ message: "success", orders })
  } catch(err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
}

exports.getOrderAdmin = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        ProductOnOrders: {
          include: {
            Product: true
          }
        },
        User: {
          select: {
            id: true,
            email: true,
            name: true,
            address: true,
          }
        }
      }
          
    })

    return res.json({ message: "success", orders })
  } catch(err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
}