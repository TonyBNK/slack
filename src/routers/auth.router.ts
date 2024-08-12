import { Router } from "express";
import authController from "../controllers/auth.controller";
import authValidation from "../validations/auth.validation";

const router = Router();

router.post(
  "/registration",
  authValidation.registration,
  authController.registration
);
router.post("/login", authValidation.login, authController.login);
router.post("/logout", authController.logout);
router.get("/activate/:link", authController.activate);
router.get("/refresh", authController.refresh);

export default router;
