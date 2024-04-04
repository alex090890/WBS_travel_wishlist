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

router.get('/countries/:code', async (req, res) => {
  const code = req.params.code.toUpperCase();

  try {
    // Query the database for a country with the given code, checking both alpha2Code and alpha3Code fields
    const country = await Country.findOne({
      $or: [
        { alpha2Code: code },
        { alpha3Code: code }
      ]
    });

    if (country) {
      // Return the country as a JSON response
      res.json(country);
    } else {
      // Handle the case where no country was found
      res.status(404).send('Country not found');
    }
  } catch (err) {
    // Handle error
    res.status(500).send('Error querying database');
  }
});

router.put('/countries/:code', async (req, res) => {
    const code = req.params.code.toUpperCase();
    const updates = req.body;

    try {
        const country = await Country.findOne({ alpha2Code: code });
        if (!country) {
            return res.status(404).json({ message: 'Country not found' });
        }

        Object.keys(updates).forEach((update) => country[update] = updates[update]);
        await country.save();

        res.status(200).json(country);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/countries/:code', async (req, res) => {
  const code = req.params.code.toUpperCase();

  try {
    // Query the database for a country with the given code
    const result = await Country.deleteOne({ $or: [ { alpha2Code: code }, { alpha3Code: code } ] });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Country not found' });
    }

    res.status(200).json({ message: 'Country successfully deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/countrieslist', async (req, res) => {
  try {
    // Fetch all countries from the database
    const countries = await Country.find({}).sort({alpha2Code: 1});

    if (countries) {
      // Start the HTML string
      let html = '<h1>Where do I want to go?</h1>'
      html += '<ol>';

      // Add each country to the HTML string
      countries.forEach(country => {
        html += `<li>${country.name} (${country.alpha2Code}, ${country.alpha3Code})</li>`;
      });

      // End the HTML string
      html += '</ol>';

      // Send the HTML string as a response
      res.send(html);
    } else {
      // Handle the case where no countries were found
      res.status(404).send('No countries found');
    }
  } catch (err) {
    // Handle error
    res.status(500).send('Error querying database');
  }
});

router.get('/country/:code', async (req, res) => {
  const code = req.params.code.toUpperCase();

  try {
    // Query the database for a country with the given code, checking both alpha2Code and alpha3Code fields
    const country = await Country.findOne({
      $or: [
        { alpha2Code: code },
        { alpha3Code: code }
      ]
    });

    if (country) {
      let html = `<h1>${country.name}</h1>`;
      html += `<p><strong>Alpha-2 code:</strong> ${country.alpha2Code}</p>`;
      html += `<p><strong>Alpha 3 code:</strong> ${country.alpha3Code}</p>`;
      res.send(html);
    } else {
      // Handle the case where no country was found
      res.status(404).send('Country not found');
    }
  } catch (err) {
    // Handle error
    res.status(500).send('Error querying database');
  }
});

export default router;