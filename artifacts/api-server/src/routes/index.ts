import { Router, type IRouter } from "express";
import healthRouter from "./health";
import examchainDataRouter from "./examchain-data";

const router: IRouter = Router();

router.use(healthRouter);
router.use(examchainDataRouter);

export default router;
