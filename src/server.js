const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const { animals } = require('./model/')

app.use(bodyParser.json())

app.get('/api/animals', async (req, res, next) =>
  animals.findAll()
    .then(result => 
      res.status(200).json({
        total: (Object.keys(result)).length,
        data: result
      })
    )
    .catch(next)
)

app.get('/api/animals/:animalId', async (req, res, next) => {
  const id = req.params.animalId

  return animals.findById(id)
    .then(result => {
      if(!result) {
        return res.status(404).json({ error: `The record ${id} couldn't be found.` })  
      }
      return res.status(200).json(result)
    })
    .catch(next)
})

app.post('/api/animals', async (req, res, next) => {
  const data = Object.assign({}, req.body)

  return animals.create(data)
    .then(result => res.status(201).json(result))
    .catch(next)
})

app.patch('/api/animals/:animalId', async (req, res, next) => {
  const id = req.params.animalId
  let data = req.body

  return animals.update(data, id)
    .then(result => {
      if(!result) {
        return res.status(404).json({ error: `The record ${id} couldn't be found.` })  
      }
      return res.status(200).json(result)
    })
    .catch(next)
})

app.delete('/api/animals/:animalId', async (req, res, next) => {
  const id = req.params.animalId

  return animals.destroy(id)
    .then(result => {
      if (!result) {
        return res.status(404).json({ error: `The record ${id} couldn't be found.` })  
      }
      res.status(204).send('OK')
    })
    .catch(next)
})

module.exports = { app }
