import express from 'express';
import { createDestination, deleteDestination, getAllDestinations, getAllToursOfDestination, getDestinations , getToursOfDestination, updateDestination,getDestinationById, getAllDestinationsStatusPublic } from '../Controllers/destination.js';
import { verifyAdmin } from '../utils/verifyToken.js';

const routerDestination = express.Router();

// lấy danh sách destination
// http://localhost:8800/api/destination/alltours/2
routerDestination.get("/",getAllDestinations)
routerDestination.get("/publish",getAllDestinationsStatusPublic)

// lay danh sach destination status published trang :id
routerDestination.get('/tourspublished/:page', getDestinations );

// lấy tours trong destination :id
routerDestination.get("/:id/tour",getToursOfDestination)

// lay destination :id status published
routerDestination.get('/:id', getDestinationById);

// lay tour trong destination :id status published
routerDestination.get('/:id/tours', getAllToursOfDestination);

// lay tour published trong destination :id status published
// routerDestination.get('/:id/tours/published', getPublishedToursOfDestination);


routerDestination.post('/',verifyAdmin, createDestination);
// routerDestination.post('/', createDestination);
routerDestination.put('/:id',verifyAdmin, updateDestination);
routerDestination.delete('/:id',verifyAdmin, deleteDestination);

export default routerDestination;