import express from "express";
import * as pageController from "../controllers/pageController.js" //collects all exported members under the pageController object
// import { getIndexPage,getAboutPage } from "../controllers/pageController.js";  //another use


const router =express.Router();

router.route("/").get(pageController.getIndexPage);
router.route("/about").get(pageController.getAboutPage);
router.route("/register").get(pageController.getRegisterPage);
router.route("/login").get(pageController.getLoginPage);
router.route("/logout").get(pageController.getLogout);

export default router;