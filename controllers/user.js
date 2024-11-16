const prisma = require("../config/prisma");

exports.listUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
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

    return res.json({ message: "success", users })
  } catch(err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
}

exports.changeStatus = async (req, res) => {
  try {
    const { id, enabled } = req.body;
    const user = await prisma.user.update({
      where: {
        id: parseInt(id)
      },
      data: {
        enabled: enabled
      }
    })

    return res.json({ message: "success"})
  } catch(err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
}

exports.changeRole = async (req, res) => {
  try {
    const { id, role } = req.body;
    const user = await prisma.user.update({
      where: {
        id: parseInt(id)
      },
      data: {
        role: role
      }
    })

    return res.json({ message: "success"})
  } catch(err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
}



    // check quantity
    // for(const item of userCart.ProductOnCarts) {
    //   const product = await prisma.product.findUnique({
    //     where : {
    //       id: item.productId
    //     },
    //     select: {
    //       quantity: true,
    //       title: true
    //     }
    //   })

    //   if (!product || item.count > product.quantity) {
    //     return res.status(400).send({ message: `ขออภัย สินค้า ${product?.title || 'product' } หมด`})
    //   }
    // }


exports.userCart = async (req, res) => {

  try {
    const { carts } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        id: parseInt(req.user.id)
      }
    });

  // check quantity
  for(const item of carts) {
    const product = await prisma.product.findUnique({
      where : {
        id: item.id
      },
      select: {
        quantity: true,
        title: true
      }
    })

    if (!product || item.count > product.quantity) {
      return res.status(400).send({ message: `ขออภัย สินค้า ${product?.title || 'product' } หมด`})
    }
  }


    // delete old Cart item
    await prisma.productOnCart.deleteMany({
      where: {
        Cart: {
          userId: user.id
        }
      }
    })

    // delete old Cart
    await prisma.cart.deleteMany({
      where: {
        userId: user.id
      }
    })

    // เตรียมสินค้า
    let products = carts.map((item) => ({
      productId: item.id,
      count: item.count,
      price: item.price
    }))

    // หาผลรวม
    let cartTotal = products.reduce((sum, item) => 
      sum + item.price * item.count, 0
    )
    
    // new cart
    const newCart = await prisma.cart.create({
      data: {
        cartTotal: cartTotal,
        userId: user.id,
        ProductOnCarts: {
          create: products
        }
      }
    })    
    return res.json({ message: "success" })
  } catch(err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
}

exports.getUserCart = async (req, res) => {
  try {
    const cart = await prisma.cart.findFirst({
      where: {
        userId: req.user.id
      },
      include: {
        ProductOnCarts: {
          include: {
            Product: true
          }
        }
      }
    })

    return res.json({ 
      message: "success", 
      products: cart.ProductOnCarts,
      cartTotal: cart.cartTotal 
    })
  } catch(err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
}

exports.removeCart = async (req, res) => {
  try {
    const cart = await prisma.cart.findFirst({
      where: {
        userId: req.user.id
      }
    })

    if (!cart) {
      return res.status(400).send({ message: "No cart!!"})
    }

    // delete old Cart item
    await prisma.productOnCart.deleteMany({
      where: {
        cartId: cart.id
      }
    })

    // delete old Cart
    await prisma.cart.deleteMany({
      where: {
        userId: req.user.id
      }
    })

    return res.send({ message: "success", result: cart })
  } catch(err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
}

exports.saveAddress = async (req, res) => {
  try {
    const { address } = req.body;

    const addressUser = await prisma.user.update({
      where: {
        id: req.user.id
      },
      data: {
        address: address
      }
    })

    return res.json({ message: "success" })
  } catch(err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
}

exports.saveOrder = async (req, res) => {
  try {
    // Step 0 Check stripe
    // console.log(req.body)
    // return res.send("hello saveOrder")

    const { id, amount, status, currency } = req.body.paymentIntent;

    // Step 1 Get user cart
    const userCart = await prisma.cart.findFirst({
      where: {
        userId: req.user.id
      },
      include: {
        ProductOnCarts : true
      }
    })

    // check cart empty
    if (!userCart || userCart.ProductOnCarts.length === 0) {
      return res.status(400).send({ message: "Cart is Empty" })
    }



    // create new order

    const amountTHB = Number(amount) / 100
    const order = await prisma.order.create({
      data: {
        ProductOnOrders: {
          create: userCart.ProductOnCarts.map((item) => ({
            productId: item.productId,
            count: item.count,
            price: item.price
          }))
        },
        User: {
          connect: {
            id: req.user.id
          }
        }, 
        cartTotal: userCart.cartTotal,
        stripePaymentId: id,
        amount: amountTHB,
        status: status,
        currency: currency
      },
    })

    // เตรียม Object update Product
    const update = userCart.ProductOnCarts.map((item) => ({
      where: {
        id: item.productId
      },
      data: {
        quantity: { decrement: item.count},
        soid: { increment: item.count }
      },
    }))

    await Promise.all(
      update.map((updated) => prisma.product.update(updated))
    );

    await prisma.cart.deleteMany({
      where: {
        userId: req.user.id
      }
    })

    return res.json({ message: "success", order })
  } catch(err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
}

exports.getOrder = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: req.user.id
      },
      include: {
        ProductOnOrders: {
          include: {
            Product: true
          }
        }
      }
    })
    
    if (orders.length === 0) {
      return res.status(400).json({ message: "No orders" })
    }
    
    return res.json({ message: "success", orders })
  } catch(err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
}