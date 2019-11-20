const index = (req, res) => {
    res.render('index', { title: 'Qualen' });
};

module.exports = {
    index
};