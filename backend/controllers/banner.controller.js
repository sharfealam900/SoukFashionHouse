import Banner from "../models/banner.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

const optimizeCloudinaryImage = (url, width = 1600) => {
    if (
        !url ||
        !url.includes("res.cloudinary.com")
    ) {
        return url;
    }

    if (url.includes("/upload/")) {
        return url.replace(
            "/upload/",
            `/upload/f_auto,q_auto,w_${width}/`
        );
    }

    return url;
};

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

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Banner title is required.",
            });
        }

        if (
            !req.files ||
            req.files.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Banner image is required.",
            });
        }

        const result =
            await uploadToCloudinary(
                req.files[0].buffer,
                "banners"
            );

        const banner = await Banner.create({
            title: title.trim(),
            subtitle: subtitle?.trim() || "",
            buttonText:
                buttonText?.trim() || "",
            buttonLink:
                buttonLink?.trim() || "",
            image: result.secure_url,
            isActive:
                isActive === undefined
                    ? true
                    : isActive === "true" ||
                      isActive === true,
            displayOrder:
                Number(displayOrder) || 0,
        });

        return res.status(201).json({
            success: true,
            message:
                "Banner created successfully.",
            banner,
        });
    } catch (error) {
        console.error(
            "CREATE BANNER ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to create banner.",
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
        })
            .select(
                "title subtitle buttonText buttonLink image displayOrder"
            )
            .sort({
                displayOrder: 1,
            })
            .lean();

        const optimizedBanners =
            banners.map((banner) => ({
                ...banner,
                image: optimizeCloudinaryImage(
                    banner.image,
                    1600
                ),
            }));

        res.set(
            "Cache-Control",
            "public, max-age=60, s-maxage=300, stale-while-revalidate=600"
        );

        return res.status(200).json({
            success: true,
            banners: optimizedBanners,
        });
    } catch (error) {
        console.error(
            "GET ACTIVE BANNERS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to load active banners.",
        });
    }
};

export const getAllBanners = async (
    req,
    res
) => {
    try {
        const banners = await Banner.find()
            .select(
                "title subtitle buttonText buttonLink image isActive displayOrder createdAt updatedAt"
            )
            .sort({
                displayOrder: 1,
            })
            .lean();

        const optimizedBanners =
            banners.map((banner) => ({
                ...banner,
                image: optimizeCloudinaryImage(
                    banner.image,
                    1600
                ),
            }));

        return res.status(200).json({
            success: true,
            totalBanners:
                optimizedBanners.length,
            banners: optimizedBanners,
        });
    } catch (error) {
        console.error(
            "GET ALL BANNERS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to load banners.",
        });
    }
};

export const getBannerById = async (
    req,
    res
) => {
    try {
        const banner =
            await Banner.findById(
                req.params.id
            ).lean();

        if (!banner) {
            return res.status(404).json({
                success: false,
                message:
                    "Banner not found.",
            });
        }

        return res.status(200).json({
            success: true,
            banner: {
                ...banner,
                image:
                    optimizeCloudinaryImage(
                        banner.image,
                        1600
                    ),
            },
        });
    } catch (error) {
        console.error(
            "GET BANNER BY ID ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to load banner.",
        });
    }
};

export const updateBanner = async (
    req,
    res
) => {
    try {
        const banner =
            await Banner.findById(
                req.params.id
            );

        if (!banner) {
            return res.status(404).json({
                success: false,
                message:
                    "Banner not found.",
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

        if (title !== undefined) {
            if (!title.trim()) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Banner title is required.",
                });
            }

            banner.title = title.trim();
        }

        if (subtitle !== undefined) {
            banner.subtitle =
                subtitle.trim();
        }

        if (buttonText !== undefined) {
            banner.buttonText =
                buttonText.trim();
        }

        if (buttonLink !== undefined) {
            banner.buttonLink =
                buttonLink.trim();
        }

        if (isActive !== undefined) {
            banner.isActive =
                isActive === "true" ||
                isActive === true;
        }

        if (
            displayOrder !== undefined
        ) {
            banner.displayOrder =
                Number(displayOrder) || 0;
        }

        if (
            req.files &&
            req.files.length > 0
        ) {
            const result =
                await uploadToCloudinary(
                    req.files[0].buffer,
                    "banners"
                );

            banner.image =
                result.secure_url;
        }

        await banner.save();

        return res.status(200).json({
            success: true,
            message:
                "Banner updated successfully.",
            banner,
        });
    } catch (error) {
        console.error(
            "UPDATE BANNER ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to update banner.",
        });
    }
};

export const deleteBanner = async (
    req,
    res
) => {
    try {
        const banner =
            await Banner.findById(
                req.params.id
            );

        if (!banner) {
            return res.status(404).json({
                success: false,
                message:
                    "Banner not found.",
            });
        }

        await banner.deleteOne();

        return res.status(200).json({
            success: true,
            message:
                "Banner deleted successfully.",
        });
    } catch (error) {
        console.error(
            "DELETE BANNER ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to delete banner.",
        });
    }
};