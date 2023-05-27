import { mongoose, Schema } from "mongoose";

const wheel = {
  toothSpacing: "",
  degree: 0,
  wheelNumber: 0,
  lastChanged: "",
};
const wheelSchema = new mongoose.Schema({
  wheel: {
    type: String,
    required: true,
  },
  toothSpacing: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  wheelNumber: {
    type: String,
    required: true,
  },
  lastChanged: {
    type: String,
    required: false,
  },
});

export default mongoose.model("Wheel", wheelSchema);
