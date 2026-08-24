import Subscriber from "../models/subscriber.model.js";



export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const existingSubscriber = await Subscriber.findOne({
      email: email.toLowerCase(),
    });

    if (existingSubscriber) {
      return res.status(400).json({
        success: false,
        message: "You are already subscribed.",
      });
    }

    const subscriber = await Subscriber.create({
      email: email.toLowerCase(),
    });

    res.status(201).json({
      success: true,
      message: "Subscribed successfully.",
      subscriber,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      totalSubscribers: subscribers.length,
      subscribers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;

    const subscriber = await Subscriber.findById(id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Subscriber not found.",
      });
    }

    await subscriber.deleteOne();

    res.status(200).json({
      success: true,
      message: "Subscriber deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const exportSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({
      createdAt: -1,
    });

    let csv = "Email,Subscribed On\n";

    subscribers.forEach((subscriber) => {
      csv += `${subscriber.email},${new Date(
        subscriber.createdAt
      ).toLocaleString("en-IN")}\n`;
    });

    res.header("Content-Type", "text/csv");
    res.attachment("subscribers.csv");

    return res.send(csv);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};