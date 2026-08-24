import Banner from "../models/banner.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";



export const createBanner = async (req, res) => {
    try {
        const {
            title,
            subtitle,
            buttonText,
            buttonLink,
            isActive,
            displayOrder,
        } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Banner title is required.",
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Banner image is required.",
            });
        }

        const result = await uploadToCloudinary(
            req.files[0].buffer,
            "banners"
        );

        const banner = await Banner.create({
            title,
            subtitle,
            buttonText,
            buttonLink,
            image: result.secure_url,
            isActive,
            displayOrder,
        });

        res.status(201).json({
            success: true,
            message: "Banner created successfully.",
            banner,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



export const getActiveBanners = async (
    req,
    res
) => {
    try {
        const banners = await Banner.find({
            isActive: true,
        }).sort({
            displayOrder: 1,
        });

        res.status(200).json({
            success: true,
            banners,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



export const getAllBanners = async (
    req,
    res
) => {
    try {
        const banners = await Banner.find().sort({
            displayOrder: 1,
        });

        res.status(200).json({
            success: true,
            totalBanners: banners.length,
            banners,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



export const getBannerById = async (
    req,
    res
) => {
    try {
        const banner = await Banner.findById(
            req.params.id
        );

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found.",
            });
        }

        res.status(200).json({
            success: true,
            banner,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



export const updateBanner = async (
    req,
    res
) => {
    try {
        const banner = await Banner.findById(
            req.params.id
        );

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found.",
            });
        }

        const {
            title,
            subtitle,
            buttonText,
            buttonLink,
            isActive,
            displayOrder,
        } = req.body;

        banner.title = title;
        banner.subtitle = subtitle;
        banner.buttonText = buttonText;
        banner.buttonLink = buttonLink;
        banner.isActive = isActive;
        banner.displayOrder = displayOrder;

        if (
            req.files &&
            req.files.length > 0
        ) {
            const result = await uploadToCloudinary(
                req.files[0].buffer,
                "banners"
            );

            banner.image = result.secure_url;
        }

        await banner.save();

        res.status(200).json({
            success: true,
            message: "Banner updated successfully.",
            banner,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const deleteBanner = async (
    req,
    res
) => {
    try {
        const banner = await Banner.findById(
            req.params.id
        );

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found.",
            });
        }

        await banner.deleteOne();

        res.status(200).json({
            success: true,
            message: "Banner deleted successfully.",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};