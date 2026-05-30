import { Router, type IRouter } from "express";
import healthRouter from "./health";
import anchorsRouter from "./anchors";
import exportsRouter from "./exports";

const router: IRouter = Router();

router.use(healthRouter);
router.use(anchorsRouter);
router.use(exportsRouter);

export default router;
