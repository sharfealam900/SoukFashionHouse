import Contact from "../models/contact.model.js";
import nodemailer from "nodemailer";

/* ===================================
   SEND MESSAGE
=================================== */

export const sendMessage = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
    } = req.body;

    if (
      !name ||
      !email ||
      !subject ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      contact,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/* ===================================
   GET ALL MESSAGES (ADMIN)
=================================== */

export const getAllMessages = async (req, res) => {

  try {

    const messages = await Contact.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalMessages: messages.length,
      messages,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

/* ===================================
   GET SINGLE MESSAGE
=================================== */

export const getSingleMessage = async (req, res) => {

  try {

    const message = await Contact.findById(
      req.params.id
    );

    if (!message) {

      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });

    }

    res.status(200).json({
      success: true,
      message,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

/* ===================================
   UPDATE STATUS
=================================== */

export const updateStatus = async (req, res) => {

  try {

    const { status } = req.body;

    const message = await Contact.findById(
      req.params.id
    );

    if (!message) {

      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });

    }

    message.status = status;

    await message.save();

    res.status(200).json({
      success: true,
      message: "Status updated.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

/* ===================================
   REPLY TO CUSTOMER
=================================== */

export const replyMessage = async (req, res) => {

  try {

    const { reply } = req.body;

    const message = await Contact.findById(
      req.params.id
    );

    if (!message) {

      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });

    }

    const transporter = nodemailer.createTransport({

      service: "gmail",

      auth: {

        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,

      },

    });

    await transporter.sendMail({

      from: `"SOUK Fashion House" <${process.env.EMAIL_USER}>`,

      to: message.email,

      subject: `Re: ${message.subject}`,

      html: `
      <div style="font-family:Arial;padding:20px">

        <h2>SOUK Fashion House</h2>

        <p>Hello ${message.name},</p>

        <p>${reply}</p>

        <br/>

        <strong>Thank you.</strong>

      </div>
      `,

    });

    message.adminReply = reply;
    message.status = "Replied";
    message.repliedAt = new Date();

    await message.save();

    res.status(200).json({
      success: true,
      message: "Reply sent successfully.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

/* ===================================
   DELETE MESSAGE
=================================== */

export const deleteMessage = async (req, res) => {

  try {

    const message = await Contact.findById(
      req.params.id
    );

    if (!message) {

      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });

    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      message: "Message deleted successfully.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};