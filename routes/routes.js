import express from 'express';
import { validationResult } from 'express-validator';
import { Country } from '../modules/modules.js';

const router = express.Router();

router.get('/countries', async (req, res) => {
    try {
        let countries;

        if(req.query.sort === 'true') {
            countries = await Country.find().sort({ name: 1})
        } else {
            countries = await Country.find()
        }

        res.json(countries);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get("/countrieslist", function(req, res) {
    
});

router.post('/countries', async (req, res) => {
    // Validation
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // Existed country data
    const { alpha2Code, alpha3Code } = req.body;
    const existingCountry = await Country.findOne({
        $or: [
            { alpha2Code: alpha2Code.toUpperCase() },
            { alpha3Code: alpha3Code.toUpperCase() }
        ]
    });

    if(existingCountry) {
        return res.status(400).json({ message: 'Country is already existed!'})
    }

    // Create a new country

    const country = new Country({
        name: req.body.name,
        alpha2Code: alpha2Code.toUpperCase(),
        alpha3Code: alpha3Code.toUpperCase(),
        visited: false
    });
    try {
        const newCountry = await country.save()
        res.status(201).json(newCountry)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/countries/:code', (req, res) => {
  const code = req.params.code;

  // Query the database for a country with the given code
  db.collection('countries').findOne({ $or: [ { alpha2Code: code }, { alpha3Code: code } ] }, (err, country) => {
    if (err) {
      // Handle error
    } else if (country) {
      // Return the country as a JSON response
      res.json(country);
    } else {
      // Handle the case where no country was found
    }
  });
});



export default router;