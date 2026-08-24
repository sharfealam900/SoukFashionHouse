import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import sendEmail from "../utils/sendEmail.js";
import Otp from "../models/otp.model.js";
import crypto from "crypto";
import ResetOtp from "../models/resetOtp.model.js";


export const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            confirmPassword,
            phone,
        } = req.body;

        // -----------------------------
        // VALIDATION
        // -----------------------------

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields.",
            });
        }

        if (
            confirmPassword !== undefined &&
            password !== confirmPassword
        ) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match.",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // -----------------------------
        // CHECK EXISTING USER
        // -----------------------------

        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists.",
            });
        }

        // -----------------------------
        // REMOVE OLD OTP
        // -----------------------------

        await Otp.deleteOne({
            email: normalizedEmail,
        });

        // -----------------------------
        // HASH PASSWORD
        // -----------------------------

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        // -----------------------------
        // GENERATE OTP
        // -----------------------------

        const otp = crypto
            .randomInt(100000, 1000000)
            .toString();

        // -----------------------------
        // SAVE TEMPORARY REGISTRATION
        // -----------------------------

        await Otp.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            phone: phone || "",
            otp,
            expiresAt: new Date(
                Date.now() + 10 * 60 * 1000
            ),
        });

        // -----------------------------
        // SEND EMAIL
        // -----------------------------

        try {
            await sendEmail(
                normalizedEmail,
                "Verify Your Email",
                otp
            );

            console.log(
                `✅ Registration OTP sent successfully to ${normalizedEmail}`
            );

            return res.status(200).json({
                success: true,
                message: "OTP sent to your email.",
            });

        } catch (emailError) {

            console.error(
                "❌ REGISTRATION EMAIL ERROR:",
                emailError
            );

            // Remove temporary OTP because
            // email was not successfully sent
            await Otp.deleteOne({
                email: normalizedEmail,
            });

            return res.status(500).json({
                success: false,
                message:
                    "Unable to send OTP email. Please try again later.",
            });
        }

    } catch (error) {

        console.error(
            "❌ REGISTER ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Registration failed.",
        });
    }
};






export const verifyRegisterOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required.",
            });
        }

        const otpData = await Otp.findOne({ email });

        if (!otpData) {
            return res.status(400).json({
                success: false,
                message: "OTP expired or not found.",
            });
        }

        if (otpData.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP.",
            });
        }

        const user = await User.create({
            name: otpData.name,
            email: otpData.email,
            password: otpData.password,
            phone: otpData.phone,
            isVerified: true,
        });

        await Otp.deleteOne({ email });

        generateToken(res, user._id);

        res.status(201).json({
            success: true,
            message: "Email verified successfully.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                avatar: user.avatar,
                role: user.role,
            },
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};







export const resendRegisterOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required.",
            });
        }

        const normalizedEmail = email
            .trim()
            .toLowerCase();

        const otpData = await Otp.findOne({
            email: normalizedEmail,
        });

        if (!otpData) {
            return res.status(404).json({
                success: false,
                message:
                    "Registration session expired. Please register again.",
            });
        }

        // -----------------------------
        // GENERATE NEW OTP
        // -----------------------------

        const otp = crypto
            .randomInt(100000, 1000000)
            .toString();

        otpData.otp = otp;

        otpData.expiresAt = new Date(
            Date.now() + 10 * 60 * 1000
        );

        await otpData.save();

        // -----------------------------
        // SEND EMAIL
        // -----------------------------

        try {
            await sendEmail(
                normalizedEmail,
                "Verify Your Email",
                otp
            );

            console.log(
                `✅ New registration OTP sent to ${normalizedEmail}`
            );

            return res.status(200).json({
                success: true,
                message:
                    "A new OTP has been sent to your email.",
            });

        } catch (emailError) {

            console.error(
                "❌ RESEND OTP EMAIL ERROR:",
                emailError
            );

            return res.status(500).json({
                success: false,
                message:
                    "Unable to send OTP email. Please try again later.",
            });
        }

    } catch (error) {

        console.error(
            "❌ RESEND REGISTER OTP ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Unable to resend OTP.",
        });
    }
};







export const loginUser = async (req, res) => {
  try {
    console.log("🔥 USER CONTROLLER LOGIN IS RUNNING");
    console.log("LOGIN BODY:", req.body);

    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // 2. Find user
    // +password is important if password is select:false in your schema
    const user = await User.findOne({ email }).select("+password");

    console.log("USER FOUND:", !!user);

    // 3. IMPORTANT:
    // Check whether user exists BEFORE accessing user.isBlocked
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // 4. Check whether account is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked.",
      });
    }

    // 5. Check password
    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // 6. Generate authentication token
    generateToken(res, user._id);

    // 7. Send successful response
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        avatar: user.avatar,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("❌ LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const logoutUser = (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};


export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};




export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const {
            name,
            phone,
            address,

        } = req.body;

        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (address !== undefined) user.address = address;



        if (req.file) {
            const result = await uploadToCloudinary(
                req.file.buffer,
                "avatars"
            );

            user.avatar = {
                public_id: result.public_id,
                url: result.secure_url,
            };
        }

        await user.save();

        const updatedUser = await User.findById(user._id).select("-password");

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        const user = await User.findById(req.user.id).select("+password");

        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



export const getAllUsers = async (req, res) => {
    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const totalUsers = await User.countDocuments();

        const users = await User.find({})
            .select("-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            users,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};




export const updateUserByAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, role } = req.body;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.name = name;
        user.email = email;
        user.phone = phone;
        user.role = role;

        await user.save();

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};





export const toggleBlockUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.isBlocked = !user.isBlocked;

        await user.save();

        res.status(200).json({
            success: true,
            message: user.isBlocked
                ? "User blocked successfully"
                : "User unblocked successfully",
            user,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};





export const testEmail = async (req, res) => {
    try {
        await sendEmail(
            req.body.email,
            "SOUK Fashion House OTP",
            "123456"
        );

        res.status(200).json({
            success: true,
            message: "Email sent successfully.",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};




export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required.",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email.",
            });
        }

        await ResetOtp.deleteOne({ email });

        const otp = crypto.randomInt(100000, 999999).toString();

        await ResetOtp.create({
            email,
            otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        });

        res.status(200).json({
            success: true,
            message: "OTP sent to your email.",
        });

        sendEmail(email, "Reset Your Password", otp)
            .then(() => {
                console.log(`✅ Reset OTP sent to ${email}`);
            })
            .catch((error) => {
                console.error(error);
                ResetOtp.deleteOne({ email }).catch(() => { });
            });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};






export const verifyResetOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required.",
            });
        }

        const otpData = await ResetOtp.findOne({ email });

        if (!otpData) {
            return res.status(400).json({
                success: false,
                message: "OTP expired or not found.",
            });
        }

        if (otpData.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP.",
            });
        }
        otpData.isVerified = true;

        await otpData.save();

        res.status(200).json({
            success: true,
            message: "OTP verified successfully.",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};




export const resetPassword = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;

        if (!email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match.",
            });
        }

        const otpData = await ResetOtp.findOne({ email });

        if (!otpData.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Please verify OTP first.",
            });
        }

        if (!otpData) {
            return res.status(400).json({
                success: false,
                message: "OTP verification expired.",
            });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        user.password = await bcrypt.hash(password, 10);

        await user.save();

        await ResetOtp.deleteOne({ email });

        res.status(200).json({
            success: true,
            message: "Password reset successfully.",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};




export const resendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const otpData = await ResetOtp.findOne({ email });

    if (!otpData) {
      return res.status(404).json({
        success: false,
        message: "Reset session expired. Please try again.",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    otpData.otp = otp;
    otpData.isVerified = false;
    otpData.expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await otpData.save();

    sendEmail(email, "Reset Your Password", otp).catch((error) => {
      console.error(error);
    });

    res.status(200).json({
      success: true,
      message: "A new OTP has been sent to your email.",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};