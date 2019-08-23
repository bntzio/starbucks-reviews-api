const express = require('express')
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')

const { Location } = require('./api/models/location')

require('dotenv').config({path: __dirname + '/.env'})
require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3001

app.use(bodyParser.json())

app.get('/locations', (_req, res) => {
  Location.find({}).then(locations => {
    res.send({ locations })
  }, err => res.status(400).send(err))
})

app.post('/locations', (req, res) => {
  const { name, city, image, address } = req.body

  if (!name || !city || !image || !address) {
    return res.status(404).send()
  }

  const location = new Location({
    name,
    city,
    image,
    address
  })

  location.save().then(loc => {
    res.send(loc)
  }, err => res.status(400).send(err))
})

app.delete('/locations/:id', (req, res) => {
  const id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Location.findOneAndRemove({ _id: id }).then(loc => {
    if (!loc) {
      return res.status(404).send()
    }
    res.send({ location: loc })
  }).catch(err => res.status(400).send(err))
})

app.post('/locations/upvote/:id', (req, res) => {
  const id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Location.findByIdAndUpdate({ _id: id }, { $inc: { 'votes': 1 } }, { new: true }).then(loc => {
    if (!loc) {
      return res.status(404).send()
    }
    res.send({ location: loc })
  }).catch(err => res.status(400).send(err))
})

app.post('/locations/downvote/:id', (req, res) => {
  const id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Location.findByIdAndUpdate({ _id: id }, { $inc: { 'votes': -1 } }, { new: true }).then(loc => {
    if (!loc) {
      return res.status(404).send()
    }
    res.send({ location: loc })
  }).catch(err => res.status(400).send(err))
})

app.post('/locations/edit/:id', (req, res) => {
  const id = req.params.id
  const { name, city, image, address } = req.body

  if (!ObjectID.isValid(id) || !name || !city || !image || !address) {
    return res.status(404).send()
  }

  Location.updateOne({ _id: id }, { $set: { name, city, image, address } }).then(loc => {
    if (!loc) {
      return res.status(404).send()
    }
    res.send({ location: loc })
  }).catch(err => res.status(400).send(err))
})

app.listen(port, () => console.log(`Server up and running in port ${port}`))
