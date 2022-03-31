const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('connecting to' , url)
// `mongodb+srv://fullstack:${password}@cluster0.muvuf.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.connect(url)
    .then(result => {
        console.log('conncted to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
