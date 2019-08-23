const mongoose = require('mongoose')

const Location = mongoose.model('Location', {
  name: {
    type: String,
    required: true,
    minlength: 8
  },
  city: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true,
    minlength: 14
  },
  votes: {
    type: Number,
    default: 0
  }
})

module.exports = { Location }
