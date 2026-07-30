import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import Order from "../models/order.model.js";



export const getDashboardStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalProducts,
            totalCategories,
            totalOrders,
            pendingOrders,
            deliveredOrders,
            outOfStockProducts,
            revenueResult,
            recentOrders,
        ] = await Promise.all([
            User.countDocuments(),
            Product.countDocuments(),
            Category.countDocuments(),
            Order.countDocuments(),
            Order.countDocuments({ orderStatus: "Pending" }),
            Order.countDocuments({ orderStatus: "Delivered" }),
            Product.countDocuments({ stock: 0 }),

            Order.aggregate([
                {
                    $match: {
                        paymentStatus: "Paid",
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: {
                            $sum: "$totalAmount",
                        },
                    },
                },
            ]),

            Order.find()
                .populate("user", "name email")
                .sort({ createdAt: -1 })
                .limit(5),
        ]);

        const revenue =
            revenueResult.length > 0
                ? revenueResult[0].totalRevenue
                : 0;

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalProducts,
                totalCategories,
                totalOrders,
                pendingOrders,
                deliveredOrders,
                outOfStockProducts,
                revenue,
            },
            recentOrders,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Dashboard loading failed",
        });
    }
};



export const getRevenueAnalytics = async (req, res) => {
    try {

        const revenue = await Order.aggregate([

            {
                $match: {
                    paymentStatus: "Paid"
                }
            },

            {
                $group: {
                    _id: {
                        month: {
                            $month: "$createdAt"
                        }
                    },

                    revenue: {
                        $sum: "$totalAmount"
                    },

                    orders: {
                        $sum: 1
                    }
                }
            },

            {
                $sort: {
                    "_id.month": 1
                }
            }

        ]);

        res.json({
            success: true,
            revenue
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};




export const getOrderAnalytics = async (req, res) => {
  try {
    const analytics = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      analytics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load order analytics",
    });
  }
};




export const getTopProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },

      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
        },
      },

      {
        $sort: {
          totalSold: -1,
        },
      },

      {
        $limit: 5,
      },

      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },

      {
        $unwind: "$product",
      },

      {
        $project: {
          _id: 0,
          name: "$product.name",
          image: {
            $arrayElemAt: ["$product.images.url", 0],
          },
          totalSold: 1,
          price: "$product.price",
        },
      },
    ]);

    res.json({
      success: true,
      topProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load top products",
    });
  }
};





export const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      stock: { $lte: 5 },
    })
      .sort({ stock: 1 })
      .select("name stock price images");

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load low stock products",
    });
  }
};




export const getCategorySales = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      {
        $unwind: "$items",
      },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $lookup: {
          from: "categories",
          localField: "product.category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $group: {
          _id: "$category.name",
          totalSold: {
            $sum: "$items.quantity",
          },
        },
      },
      {
        $sort: {
          totalSold: -1,
        },
      },
    ]);

    res.json({
      success: true,
      sales,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load category sales",
    });
  }
};




export const getNotifications = async (req, res) => {
    try {

        const outOfStock = await Product.countDocuments({
            stock: 0,
        });

        const lowStock = await Product.countDocuments({
            stock: {
                $gt: 0,
                $lte: 5,
            },
        });

        const pendingOrders = await Order.countDocuments({
            orderStatus: "Pending",
        });

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const newUsers = await User.countDocuments({
            createdAt: {
                $gte: today,
            },
        });

        res.json({
            success: true,
            notifications: {
                outOfStock,
                lowStock,
                pendingOrders,
                newUsers,
            },
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

