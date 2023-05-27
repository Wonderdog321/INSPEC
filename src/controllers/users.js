import User from "../models/user.js";
export const createUser = async (req, res) => {
  //Parse the data to send to DB
  const { firstname, lastname, username, password } = req.body;
  //Sends info to db
  const isNewUser = await User.isInUseEmail(username);
  if (!isNewUser)
    return res.json({
      success: false,
      message:
        "This username is already in use, please log in or report to the developer.",
    });
  const newUser = await User({
    firstname,
    lastname,
    username,
    password,
  });
  await newUser.save();
  //Responds if valid or not
  res.json(newUser);
};
export const userSignIn = async (req, res) => {
  const { username, password, remember } = req.body;
  const user = await User.findOne({ username });

  if (!user)
    return res.json({
      success: false,
      message: "User not found, with the given username.",
    });

  const isMatch = await user.comparePassword(password);
  if (!isMatch)
    return res.json({
      success: false,
      message: "Username or password is wrong!",
    });
  res.json({ success: true, user });
};
