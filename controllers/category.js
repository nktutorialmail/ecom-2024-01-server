const prisma = require("../config/prisma");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    console.log("name==> ",name)  
    const categorys = await prisma.category.findFirst({
      where: {
        name: name
      }
    });
    
    if (categorys) {
      return res.status(400).json({ message: "ข้อมูลซ้ำ กรุณาป้อนใหม่"})
    }

    await prisma.category.create({
      data : {
        name: name
      }
    })

    return res.send({ message: "Create success" })
  } catch(err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
}

exports.list = async (req, res) => {
  try {
    const categorys = await prisma.category.findMany()

    if (!categorys) {
      return res.status(400).json({ message: "Categorys not found" });
    }

    return res.json({ categorys })
  } catch(err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
}

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
 
    await prisma.category.delete({
      where: {
        id: parseInt(id)
      }
    })
    return res.json({ message: "Delete success" })
  } catch(err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
}