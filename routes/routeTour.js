import express from "express";
import { createTour, deleteTour, getAllTours,getTour } from "../Controllers/tour.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const routerTour = express.Router()


routerTour.post("/",verifyAdmin,createTour)
routerTour.get("/",getAllTours)
routerTour.get("/:id",getTour)
routerTour.delete("/:id",deleteTour)


export default routerTour

