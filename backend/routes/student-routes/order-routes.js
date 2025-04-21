import express from "express";
import {
  createOrder,
  capturePaymentAndFinalizeOrder,
} from "../../controllers/student-controller/order-controller";

const router = express.Router();

router.post("/create", createOrder);
router.post("/capture", capturePaymentAndFinalizeOrder);

export { router };
