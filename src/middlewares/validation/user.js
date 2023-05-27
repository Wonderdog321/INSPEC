import { check, validationResult } from "express-validator";

export const validateUserSignUp = [
  check("firstname")
    .trim()
    .not()
    .isEmpty()
    .withMessage("First name is requried!")
    .isAlpha()
    .withMessage("First name must be letters only.")
    .isLength({ min: 3, max: 20 })
    .withMessage("First name must be within 3 to 20 characters!"),
  check("lastname")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Last name is requried!")
    .isAlpha()
    .withMessage("Last name must be letters only.")
    .isLength({ min: 3, max: 20 })
    .withMessage("Last name must be within 3 to 20 characters!"),
  check("username")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Username field is empty!")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be within 3 to 20 characters!"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password field is empty!")
    .isLength({ min: 3, max: 20 })
    .withMessage("Password must be within 6 to 20 characters long!"),
  check("confirmPassword")
    .trim()
    .not()
    .isEmpty()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Both password must be same!");
      }
      return true;
    }),
];
export const userValidation = (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();
  const error = result[0].msg;
  res.json({ success: false, message: error });
};
export const validateUserSignIn = [
  check("username")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Username field is empty!"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password field is empty!"),
  check("remember").not().isEmpty(),
];
