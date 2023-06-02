import mongoose from "mongoose";
import Blade from "../models/blade.js";

export const createBlade = async (req, res) => {
  //Parse the data to send to DB
  const {
    material,
    face,
    hook,
    back,
    grind,
    bendLocation,
    set,
    camber,
    lastChanged,
  } = req.body;
  //Sends info to db

  const newBlade = await Blade({
    material,
    face,
    hook,
    back,
    grind,
    bendLocation,
    set,
    camber,
    lastChanged,
  });
  await newBlade.save();
  //Responds if valid or not
  res.json(newBlade);
};

export const getBlades = async (req, res) => {
  const { material } = req.body;
  const blades = await Blade.find({
    material: new RegExp("^" + material, "i"),
  });
  blades
    ? res.json({ success: true, blades })
    : res.json({
        success: false,
        message: "Could not find any blade based on search query.",
      });
};

export const updateBlade = async (req, res) => {
  const { bladeID, bladeInfo } = req.body;
  const isValidID = mongoose.Types.ObjectId.isValid(bladeID);
  if (isValidID) {
    const updatingBlade = await Blade.findByIdAndUpdate(bladeID, bladeInfo, {
      new: true,
    });
    if (updatingBlade !== null) {
      res.json({ success: true, updatingBlade });
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
export const bladeToDB = async (req, res) => {
  for (const ma in data) {
    for (const dg in data[ma]) {
      setTimeout(async () => {
        const newBlade = await Blade({
          material: `${ma}${dg}`,
          face: data[ma][dg].face,
          hook: data[ma][dg].hook,
          back: data[ma][dg].back,
          grind: data[ma][dg].grind,
          bendLocation: data[ma][dg].bendLocation,
          set: data[ma][dg].sets,
          camber: data[ma][dg].camber,
          lastChanged: "",
        });
        await newBlade.save();
        //Responds if valid or not
      }, 500);
    }
  }
  res.json({ success: true });
};
