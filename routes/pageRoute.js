import express from "express";
import * as pageController from "../controllers/pageController.js" //collects all exported members under the pageController object
// import { getIndexPage,getAboutPage } from "../controllers/pageController.js";  //another use

const router =express.Router();

router.route("/").get(pageController.getIndexPage);
router.route("/about").get(pageController.getAboutPage);

export default router;