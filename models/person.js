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
    name: {
        type: String,
        minlength: 3,
        required: [true, 'name required']
    },
    number: {
        type: String,
        minlength: 8,
        validate: {
            validator: x => {
                return /\d{2,3}-\d{4,}/.test(x)
            },
            message: props => `${props.value} is not a valid phone number`
        },
        required: [true, 'phone number required']
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
