import express from "express";
import { createTour, deleteTour, getAllTours,getTour, updateTour } from "../Controllers/tour.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const routerTour = express.Router()


routerTour.post("/",verifyAdmin,createTour)
routerTour.get("/",getAllTours)
routerTour.get("/:id",getTour)
routerTour.put("/:id",updateTour)
routerTour.delete("/:id",deleteTour)


export default routerTour

