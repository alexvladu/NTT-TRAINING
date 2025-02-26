const express = require('express');
const fs = require('fs');
const app = express();
const port=3000;

app.use(express.json());

const toursData= JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json', 'utf-8'));

const getAllTours = (req, res) => {
    res.json({
        status:'success',
        result: toursData.length,
        data: {
            tours: toursData
        }
})};

const getTour= (req, res) => {
    const tour = toursData.find(t => t.id === parseInt(req.params.id));
    if(!tour) return res.status(404).json({status: 'fail', message: 'Tour not found'});
    res.json({
        status:'success',
        tour: tour
    });
};
const createTour = (req, res) => {
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

const updatedTour = (req, res) => {
    const tourIndex = toursData.findIndex(t => t.id === parseInt(req.params.id));
    if(tourIndex === -1) return res.status(404).json({status: 'fail', message: 'Tour not found'});
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

const deleteTour = (req, res) => {
    const tourIndex = toursData.findIndex(t => t.id === parseInt(req.params.id));
    if(tourIndex === -1) return res.status(404).json({status: 'fail', message: 'Tour not found'});
    toursData.splice(tourIndex, 1);
    fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(toursData), (error) => {
        if(error) return res.status(500).send('Error writing to file');
        res.json({
            status:'success',
            message: 'Tour deleted successfully'
        });
    });
}


app.route('/api/v1/tours').get(getAllTours).post(createTour);
app.route('/api/v1/tours/:id').get(getTour).patch(updatedTour).delete(deleteTour);


app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});
