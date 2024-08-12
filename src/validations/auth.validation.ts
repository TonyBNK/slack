import { check } from "express-validator";

const authValidation = {
  registration: [
    check("email", "Email is invalid").isEmail(),
    check(
      "password",
      "Password should be more than 4 and less than 20 symbols"
    ).isLength({ min: 4, max: 20 }),
  ],
  login: [
    check("email", "Invalid email").isEmail(),
    check("password", "Invalid password").isLength({ min: 4, max: 20 }),
  ],
};

export default authValidation;
