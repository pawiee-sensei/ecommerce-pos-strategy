// controllers/productController.js
const productModel = require('../models/productModel');

async function productsPanel(req, res) {
  try {
    const search = req.query.search || "";
    const category = req.query.category || "";
    const page = Number(req.query.page) || 1;

    const limit = 10;
    const offset = (page - 1) * limit;

    const products = await productModel.getProducts({ search, category, limit, offset });
    const total = await productModel.countProducts({ search, category });

    const totalPages = Math.ceil(total / limit);

    return res.render("admin/panels/products", {
      session: req.session,
      user: req.session.user,
      products,
      search,
      category,
      page,
      totalPages
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading products");
  }
}

module.exports = {
  productsPanel
};
