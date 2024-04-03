import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
    name: String,
    alpha2Code: String,
    alpha3Code: String,
    visited: {
        type: Boolean,
        default: false
    }
})

export const Country = mongoose.model('Country', countrySchema)