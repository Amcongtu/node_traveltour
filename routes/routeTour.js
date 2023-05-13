import express from "express";
import { createTour, deleteTour, findTour_Name, getAllTours,getAllToursStatusPublish,getTour, updateTour } from "../Controllers/tour.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const routerTour = express.Router()


routerTour.post("/",verifyAdmin,createTour)
routerTour.post("/find",findTour_Name)
routerTour.get("/",getAllTours)
routerTour.get("/publish",getAllToursStatusPublish)
routerTour.get("/:id",getTour)
routerTour.put("/:id",verifyAdmin,updateTour)
routerTour.delete("/:id",verifyAdmin,deleteTour)


export default routerTour

