const cloudinary = require('cloudinary').v2;

const prisma = require("../config/prisma");

// Configuration
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


exports.create = async (req, res) => {
  try {
    const { title, description, price, quantity, categoryId, Images } = req.body;

    const products = await prisma.product.findFirst({
      where: {
        title: title
      }
    });

    if (products) {
      return res.status(400).json({ message: "สินค้าซ้ำ กรุณาป้อนใหม่" });
    }

    await prisma.product.create({
      data: {
        title: title,
        description: description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        categoryId: parseInt(categoryId),
        Images: {
          create: Images.map((item) => ({
            asset_id: item.asset_id,
            public_id: item.public_id,
            url: item.url,
            secure_url: item.secure_url,
          }))
       }
      }
    });

    return res.json({ message: "success" })
  } catch(err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
}

exports.list = async (req, res) => {
  try {
    const { count } = req.params;
    const products = await prisma.product.findMany({
      take: parseInt(count),
      orderBy: {
        createdAt: "desc"
      },
      include: {
        Category: true,
        Images: true
      }
    })
    
    return res.json({ products })
  } catch(err) {
    console.log(err);
    res.status(500).send({message: err.message});
  }
}

exports.read = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await prisma.product.findFirst({
      where: {
        id: parseInt(id)
      },
      include: {
        Category: true,
        Images: true
      }
    })

    if (!products) {
      return res.status(400).json({ message: "Not found" });
    }
    
    return res.json({ products })
  } catch(err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
}

exports.update = async (req, res) => {
  try {
    const { title, description, price, quantity, categoryId, Images } = req.body;

    // ลบรูปเก่า
    await prisma.image.deleteMany({
      where: {
        productId: parseInt(req.params.id)
      }
    })

    const products = await prisma.product.update({
      where: {
        id: parseInt(req.params.id)
      },
      data: {
        title: title,
        description: description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        categoryId: parseInt(categoryId),
        Images: {
          create: Images.map((item) => ({
            asset_id: item.asset_id,
            public_id: item.public_id,
            url: item.url,
            secure_url: item.secure_url,
          }))
       }
      }
    });

    return res.json({ message: "success", products })
  } catch(err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
}

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    // step 1 ค้นหาสินค้า
    const products = await prisma.product.findFirst({
      where: {
        id: parseInt(id)
      },
      include: {
        Images: true
      }
    });

    if (!products) {
      return res.status(500).json({ message: "Product not found" })
    }

    // step 2 Promise  ลบรูปบน clound แบบ รอฉันด้วย
    const deletedImage = products.Images.map((item) => (
      new Promise((resolve, reject) => {
        // ลบจาก clound
        cloudinary.uploader.destroy(item.public_id, (error, result) => {
          if (error) reject(error)
            else resolve(result)
        });
      })
    ));

    await Promise.all(deletedImage);

    // step 3 ลบสินค้า_ในฐานข้อมูล
    await prisma.product.delete({
      where: {
        id: parseInt(id)
      }
    });

    return res.json({ message: "success" })
  } catch(err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
}

exports.listby= async (req, res) => {
  try {
    const { sort, order, limit } = req.body;
    const products = await prisma.product.findMany({
      take: limit,
      orderBy: {
        [sort]: order
      },
      include: {
        Category: true,
        Images: true
      }

    })

    return res.send({ message: "success", products });
  } catch(err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
}

const handleQuery = async (res, query) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        title: {
          contains: query
        }
      },
      include: {
        Category: true,
        Images: true
      }
    });

    return res.json({ products });
  } catch(err) {
    console.log(err)
    return res.status(500).send({ message: err.message });
  }
}

const handlePrices = async (req, res, price) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        price: {
          gte: price[0],
          lte: price[1]
        }
      },
      include: {
        Category: true,
        Images: true
      }
    })

    return res.json({ message: "success", products})
    // return res.send({ message: "success", result: products })
  } catch(err) {
    console.log(err);
    return res.status(500).send({ message: err.message})
  }
}

const handleCategory = async (req, res, category) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId: {
          in: category.map((id) => parseInt(id))
        }
      },
      include: {
        Category: true,
        Images: true
      }
    })

    return res.send({ message: "success", products })
  } catch(err) {
    console.log(err);
    return res.status(500).send({ message: err.message })
  }
}

exports.searchFilters = async (req, res) => {
  console.log("req.body ==> ",req.body)
  try {
    const { query, price, category } = req.body

    if (query) {
      await handleQuery(res, query);
    }
    
    if (price) {
      await handlePrices(req, res, price)
    }

    if (category) {
      await handleCategory(req, res, category)
    }

  } catch(err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
}


exports.createImages = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.body.form, {
      public_id: `codeNk-${Date.now()}`,
      resource_type: "auto",
      folder: "Ecom2024"
    });

    return res.json({ message: "success", result: result });
  } catch(err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
}

exports.removeImages = async (req, res) => {
  try {
    const { public_id } = req.body
    cloudinary.uploader.destroy(public_id, (result) => {
      res.send({ message: "Remove image success", result: result });
    })
  } catch(err) {
    console.log(err);
    return res.status(500).json({ message: "Server error !!"})
  }
}
