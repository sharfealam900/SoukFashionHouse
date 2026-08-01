import express from "express";

import { registerUser, loginUser, logoutUser, getProfile, updateProfile, changePassword, getAllUsers, updateUserByAdmin, deleteUser, toggleBlockUser, testEmail, verifyRegisterOtp, resendRegisterOtp, forgotPassword, verifyResetOtp, resetPassword, resendResetOtp,
} from "../controllers/user.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/verify-register-otp",verifyRegisterOtp);

router.post( "/resend-register-otp",resendRegisterOtp);

router.post("/login", loginUser);

router.post("/logout", protect, logoutUser);

router.get("/profile", protect, getProfile);

router.put("/profile", protect, upload.single("avatar"), updateProfile);

router.put("/change-password", protect, changePassword);

router.get("/admin/all", protect, isAdmin, getAllUsers);

router.put( "/admin/:id",protect, isAdmin, updateUserByAdmin);

router.delete( "/admin/:id",protect, isAdmin,deleteUser);

router.patch( "/admin/:id/block", protect, isAdmin, toggleBlockUser);

router.post("/test-email", testEmail);


router.post("/forgot-password", forgotPassword);

router.post("/verify-reset-otp", verifyResetOtp);

router.post("/reset-password", resetPassword);

router.post("/resend-reset-otp", resendResetOtp);




export default router;