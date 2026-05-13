import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import distributorsRouter from "./distributors";
import prescriptionsRouter from "./prescriptions";
import researchRouter from "./research";
import aiRouter from "./ai";
import transactionsRouter from "./transactions";
import dashboardRouter from "./dashboard";
import openaiRouter from "./openai";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(distributorsRouter);
router.use(prescriptionsRouter);
router.use(researchRouter);
router.use(aiRouter);
router.use(transactionsRouter);
router.use(dashboardRouter);
router.use(openaiRouter);

export default router;
