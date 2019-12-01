const request = require('request');
const apiOptions = {
    server: 'http://localhost:3000'
}

if (process.env.NODE_ENV === 'production') {
    apiOptions.server = 'https://fast-everglades-18873.herokuapp.com'
}

const formatDistance = (distance) => {
    let thisDistance = 0;
    let unit = 'm';

    if (distance > 1000) {
        thisDistance = parseFloat(distance / 1000).toFixed(1);
        unit = 'km';
    } else {
        thisDistance = Math.floor(distance);
    }

    return thisDistance + unit
}

const showError = (req, res, status) => {
    let title = '';
    let content = '';
    if (status === 404) {
        title = '404, page not found';
        content = 'Oh dear. Looks like you can\'t find this page. Sorry.';
    } else {
        title = status + ', something\'s gone wrong.';
        content = 'Something, somehwere, has gone just a little bit wrong.';
    }
    res.status(status);
    res.render('generic-text', {
        title,
        content
    });
};

const renderHomepage = (req, res, responseBody) => {
    let message = null;

    if(!(responseBody instanceof Array)) {
        message = "API lookup error";
        responseBody = [];
    } else {
        if (!responseBody.length) {
            message = "No places found nearby"
        }
    }

    res.render('locations-list', { 
        title: 'Loc8r - find a place to work with wifi',
        pageHeader: {
            title: 'Loc8r',
            strapline: 'Find places to work with wifi near you!'
        },
        sidebar: 'Looking for wifi and a seat? Loc8r helps you find places to work when out and abou. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you\'re looking for.',
        locations: responseBody,
        message
    });
}

const renderDetailPage = (req, res, location) => {
    res.render('location-info', {
        title: location.name,
        location: {
            name: location.name,
            address: ' 125 High Street, Reading, RG6 1PS',
            rating: 3,
            facilities: ['Hot Drinks', 'Food', 'Premium wifi'],
            coords: {lat: 51.455041, lng: -0.9690884},
            openingTimes: [{
                days: 'Monday - Friday',
                opening: '7:00am',
                closing: '7:00pm',
                closed: false
            }, {
                days: 'Saturday',
                opening: '8:00am',
                closing: '5:00pm',
                closed: false
            }, {
                days: 'Sunday',
                closed: true
            }],
            reviews: [{
                author: 'Simon Holms',
                rating: 5,
                timestamp: '16 February 2017',
                reviewText: 'What a great place.'
            }, {
                author: 'Charlie Chaplin',
                rating: 5,
                timestamp: '14 February 2017',
                reviewText: 'It was okay. Coffee wasn\'t great'
            }]
        },
        pageFooter: {
            strapLine: 'Starcups is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
            reviewStatement: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
        }
    });
}

/* GET 'home' page */
const homelist = (req, res) => {
    const path = '/api/locations';
    const requestOptions = {
        url: apiOptions.server + path,
        method: 'GET',
        json: {},
        qs: {
            lng: -95.252373,
            lat: 38.964901,
            dist: 20000
        }
    };
    request(
            requestOptions,
            (err, response, body) => {
                let data = [];
                if (response.statusCode === 200 && body.length) {
                    data = body.map((item) => {
                        item.distance = formatDistance(item.distance);
                        return item;
                    });
                }
                renderHomepage(req, res, body);
            }
    );
};

/* GET 'Location info' page */
const locationInfo = (req, res) => {
    const path = '/api/locations/' + req.params.locationid;
    const requestOptions = {
        url: apiOptions.server + path,
        method: 'GET',
        json: {}
    };

    request(
        requestOptions,
        (err, response, body) => {
            const data = body;
            if (response.statusCode === 200) {
                data.coords = {
                    lng: body.coords[0],
                    lat: body.coords[1]
                };
                renderDetailPage(req,res,data);
            } else {
                showError(req, res, response.statusCode);
            }
        }
    );
};

/* GET 'Add review' page */
const addReview = (req, res) => {
    res.render('location-review-form', {
        title: 'Add review',
        location: {
            name: 'Starcups'
        }
    });
};

module.exports = {
    homelist,
    locationInfo,
    addReview,
};