import { mongoose, Schema } from "mongoose";

const blade = {
  material: "",
  face: 0,
  hook: 0,
  back: 0,
  grind: 0,
  bendLocation: 0,
  set: 0,
  camber: 0,
  lastChanged: "",
};
const bladeSchema = new mongoose.Schema({
  material: {
    type: String,
    required: true,
  },
  face: {
    type: Number,
    required: true,
  },
  hook: {
    type: Number,
    required: true,
  },
  back: {
    type: Number,
    required: true,
  },
  grind: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  bendLocation: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  set: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  camber: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  lastChanged: {
    type: String,
    required: false,
  },
});

export default mongoose.model("Blade", bladeSchema);
