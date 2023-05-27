import express from "express";
import path from "path";
import {} from "dotenv/config";
import db from "./models/db.js";
import userRouter from "./routers/user.js";
import bladeRouter from "./routers/blades.js";
import wheelRouter from "./routers/wheels.js";
//Express variables
const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.resolve();
app.use(express.urlencoded());
//Express functions
app.use(express.static(__dirname + "/public"));
//Middleware logic
app.use(express.json());
app.use(userRouter);
app.use(bladeRouter);
app.use(wheelRouter);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
