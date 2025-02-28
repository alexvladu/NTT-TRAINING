const fs=require('fs');
const toursData= JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json', 'utf-8'));
const Tour=require('../models/tourModel');
exports.checkID = (req, res, next, id) => {
    const tour = toursData.find(t => t.id === parseInt(id));
    if(!tour) res.status(404).json({status: 'fail', message: 'Tour not found!!'});
    next();    
}
exports.checkBody= (req, res, next) =>{
    if(!req.body.name || !req.body.price)
        return res.status(400).json({status: 'fail', message: 'Missing name or price in request body'});
    next();
}

exports.getAllTours = (req, res) => {
    res.json({
        status:'success',
        result: toursData.length,
        data: {
            request_time:req.request_time,
            tours: toursData
        }
})};

exports.getTour= (req, res) => {
    const tourIndex = toursData.findIndex(t => t.id === parseInt(req.params.id));
    const tour = toursData[tourIndex];
    res.json({
        status:'success',
        tour: tour
    });
};
exports.createTour = (req, res) => {
    const tourId = toursData[toursData.length-1].id + 1;
    const newTour = Object.assign({id: tourId}, req.body);
    toursData.push(newTour);
    fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(toursData), (error) => {
        if(error) return res.status(500).send('Error writing to file');
        res.status(201).json({
            status:'success',
            data: newTour
        });
    });
};

exports.updatedTour = (req, res) => {
    const tourIndex = toursData.findIndex(t => t.id === parseInt(req.params.id));
    const updatedTour = Object.assign(toursData[tourIndex], req.body);
    toursData[tourIndex] = updatedTour;
    fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(toursData), (error) => {
        if(error) return res.status(500).send('Error writing to file');
        res.json({
            status:'success',
            data: updatedTour
        });
    });
};

exports.deleteTour = (req, res) => {
    const tourIndex = toursData.findIndex(t => t.id === parseInt(req.params.id));
    toursData.splice(tourIndex, 1);
    fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(toursData), (error) => {
        if(error) return res.status(500).send('Error writing to file');
        res.json({
            status:'success',
            message: 'Tour deleted successfully'
        });
    });
}