const express = require('express');
const router = express.Router();
const ctrlLocations = require('../controllers/locations');
const ctrlOthers = require('../controllers/others');

/* Locations pages */
router.get('/', ctrlLocations.homeList );
router.get('/location', ctrlLocations.locationInfo );
router.get('/location/review/new', ctrlLocations.addReview );

/* Other pages */
router.get('/about', ctrlLocations.about );

module.exports = router;
