import mongoose from "mongoose";
import Wheel from "../models/wheel.js";

export const createWheel = async (req, res) => {
  //Parse the data to send to DB
  const { wheel, toothSpacing, degree, wheelNumber, lastChanged } = req.body;
  //Sends info to db

  const newWheel = await Wheel({
    wheel,
    toothSpacing,
    degree,
    wheelNumber,
    lastChanged,
  });
  await newWheel.save();
  //Responds if valid or not
  res.json(newWheel);
};

export const getWheels = async (req, res) => {
  const { wheel } = req.body;
  const wheels = await Wheel.find({
    wheel: new RegExp("^" + wheel, "i"),
  });
  wheels
    ? res.json({ success: true, wheels })
    : res.json({
        success: false,
        message: "Could not find any wheels based on search query.",
      });
};

export const updateWheel = async (req, res) => {
  const { wheelID, wheelInfo } = req.body;
  const isValidID = mongoose.Types.ObjectId.isValid(wheelID);
  if (isValidID) {
    const updatingWheel = await Blade.findByIdAndUpdate(wheelID, wheelInfo, {
      new: true,
    });
    if (updatingWheel !== null) {
      res.json({ success: true, updatingWheel });
    } else {
      res.json({
        success: false,
        message: "Failed to update due to ID didn't match database.",
      });
    }
  } else {
    res.json({
      success: false,
      message: "Failed to update due to invalid ID passed.",
    });
  }
};

//For importing JSON file into DB
export const wheelToDB = async (req, res) => {
  for (const ts in data) {
    for (const dg in data[ts]) {
      setTimeout(async () => {
        const newWheel = await Wheel({
          wheel: `${ts}${dg}`,
          toothSpacing: `${ts}`,
          degree: `${dg.substring(1)}`,
          wheelNumber: data[ts][dg],
          lastChanged: "",
        });
        await newWheel.save();
        //Responds if valid or not
      }, 500);
    }
  }
  res.json({ success: true });
};
