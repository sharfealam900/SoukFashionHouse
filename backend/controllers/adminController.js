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