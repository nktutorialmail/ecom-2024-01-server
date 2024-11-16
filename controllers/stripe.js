const prisma = require("../config/prisma");
const stripe = require("stripe")('sk_test_51PfyhyDfJ8cMV0HJv6PXEA9wLB5bYt6qjaRhvRQcWj6GGGIN1r8tKrJUDtDPGgNlc0KNP0fdN2Lmue7z7MqRtWt200yoAnOGN9');

exports.payment = async (req, res) => {
  try {

    const cart = await prisma.cart.findFirst({
      where: {
        userId: req.user.id
      }
    })

    const amountTHB = cart.cartTotal * 100
   
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountTHB,
      currency: "thb",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch(err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
}

