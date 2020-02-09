const request = require('supertest')
const server = require('../src/server')
const {
  cleanDB,
  openDB,
  populateDB
} = require('./utils')
//const { animals } = require('../src/model/index')
const { animals } = require('../src/model/')
const updateTest = require('../src/model/')
/*
beforeAll(() => cleanDB())
afterAll(() => cleanDB())
*/

Data = {
  "ANI1580214599567RD121": {
    "created_at": "2020-01-28T12:29:59.567Z",
    "updated_at": "2020-01-28T12:29:59.567Z",
    "pet_name": "Belchior Fernandes Montalvão",
    "description": "Gatinho mais fofinho desse mundo",
    "animal_type": "Gato",
    "pet_age": "6 Meses",
    "sex": "Macho",
    "color": "Branco Malhado",
    "image_url": ""
  },
  "ANI1580216220549RD493": {
    "created_at": "2020-01-28T12:57:00.550Z",
    "updated_at": "2020-01-28T12:57:00.550Z",
    "pet_name": "Tereza Fernandes Montalvão",
    "description": "Gatinha mais perfeita desse mundão redondo",
    "animal_type": "Gato",
    "pet_age": "6 Meses",
    "sex": "Fêmea",
    "color": "Malhada",
    "image_url": ""
  }
}

describe('Test of funcitons...', () => {
  beforeEach(() => {
      populateDB(Data)
    })
  afterEach(() => cleanDB())

  test(`return all data using findAll`, async () => {
    const all = await animals.findAll()
    expect(all).toEqual(Data)
  })
    
  test(`return  data using findById`, async () => {
    const animalId = await animals.findById("ANI1580214599567RD121")
    expect(animalId).toEqual(Data["ANI1580214599567RD121"])
  })
  
  test(`return  created data`, async () => {
    const newData = {
      "pet_name": "Akane",
      "description": "Gata emburrada",
      "animal_type": "Gato",
      "pet_age": "42 Meses",
      "sex": "Fêmea",
      "color": "Branca",
      "image_url": ""
    }
 
    const createdData = await animals.create(newData)
    const expected = {
      updated_at: createdData['updated_at'],
      created_at: createdData['created_at'],
      ...newData
    }
    expect(createdData).toEqual(expected)
})


test(`return  data using update`, async () => {
  const updatedData = await animals.update({
    color: 'Prateado'
  }, "ANI1580214599567RD121")

  expect(updatedData).toEqual({
    "created_at": "2020-01-28T12:29:59.567Z",
    "updated_at": "2020-01-28T12:29:59.567Z",
    "pet_name": "Belchior Fernandes Montalvão",
    "description": "Gatinho mais fofinho desse mundo",
    "animal_type": "Gato",
    "pet_age": "6 Meses",
    "sex": "Macho",
    "color": "Prateado",
    "image_url": ""
  })
})

test(`return error updating with wrong iD`, async () => {
  const updatedData = await animals.update({
    color: 'Prateado'
  }, "ERROR12345678910")

  expect(updatedData).toEqual(false)
})


test(`return  data using destroy`, async () => {
    await animals.destroy("ANI1580216220549RD493")
    const destroyedData = openDB()
    expect(destroyedData).toEqual({
      "ANI1580214599567RD121": {
        "created_at": "2020-01-28T12:29:59.567Z",
        "updated_at": "2020-01-28T12:29:59.567Z",
        "pet_name": "Belchior Fernandes Montalvão",
        "description": "Gatinho mais fofinho desse mundo",
        "animal_type": "Gato",
        "pet_age": "6 Meses",
        "sex": "Macho",
        "color": "Branco Malhado",
        "image_url": ""
      }})
})

test(`return Error tryng to destroy data that doesn't exists and doesn't change my db`, async () => {
  const err = await animals.destroy("ERROR12345678910")
  const destroyedData = openDB()
  expect(destroyedData).toEqual(Data)
  expect(err).toEqual(false)
})
})



describe('The API on /api/animals Endpoint at GET method should...', () => {
  beforeAll(() => {
    populateDB(Data)
  })

  afterAll(() => cleanDB())

  test(`return 200 as status code and have 'total' and 'data' as properties`, async () => {
    expect.assertions(2)

    const res = await request(server.app).get('/api/animals')
    expect(res.statusCode).toEqual(200)
    expect(Object.keys(res.body)).toMatchObject([
      'total',
      'data'
    ])
  })


  test('Test format of data from GET method', async () => {
    expect.assertions(2)
    const res = await request(server.app).get('/api/animals')

    expect(res.body.total).toEqual(2)
    expect(typeof res.body.data).toBe('object')
 
  })

  test(`return the 'data' property with all items from DB`, async () => {
    expect.assertions(1)
    const res = await request(server.app).get('/api/animals')

    expect(res.body).toMatchObject({
      total: 2,
      data: {
        "ANI1580214599567RD121": {
          "created_at": "2020-01-28T12:29:59.567Z",
          "updated_at": "2020-01-28T12:29:59.567Z",
          "pet_name": "Belchior Fernandes Montalvão",
          "description": "Gatinho mais fofinho desse mundo",
          "animal_type": "Gato",
          "pet_age": "6 Meses",
          "sex": "Macho",
          "color": "Branco Malhado",
          "image_url": ""
        },
        "ANI1580216220549RD493": {
          "created_at": "2020-01-28T12:57:00.550Z",
          "updated_at": "2020-01-28T12:57:00.550Z",
          "pet_name": "Tereza Fernandes Montalvão",
          "description": "Gatinha mais perfeita desse mundão redondo",
          "animal_type": "Gato",
          "pet_age": "6 Meses",
          "sex": "Fêmea",
          "color": "Malhada",
          "image_url": ""
        }
      }
    })
  })
})



describe('The API on /api/animals/:id Endpoint at GET method should...', () => {
  beforeAll(() => {
    populateDB(Data)
  })

  afterAll(() => cleanDB())

  test(`return 200 as status code and have the corrects properties`, async () => {
    expect.assertions(2)
    const res = await request(server.app).get('/api/animals/ANI1580216220549RD493')
    expect(res.statusCode).toEqual(200)
    expect(Object.keys(res.body)).toMatchObject(Object.keys(Data["ANI1580216220549RD493"]))
  })

  test(`return 404 as status code and error mensage for a wrong Id`, async () => {
    expect.assertions(2)
    const wrongId = await request(server.app).get('/api/animals/wrongId')
    expect(wrongId.statusCode).toEqual(404)
    expect(wrongId.body).toEqual({ error: `The record wrongId couldn't be found.` })
  
  })

})

describe('The API on /api/animals Endpoint at POST method should...', () => {
  beforeAll(() => {
    populateDB(Data)
  })

  afterAll(() => cleanDB())

  test(`return 201 as status code `, async () => {
    expect.assertions(2)

    const NewData = {
          "created_at": "2020-02-04T12:57:00.550Z",
          "updated_at": "2020-02-04T12:57:00.550Z",
          "pet_name": "Mandioca",
          "description": "Dorme o dia inteiro",
          "animal_type": "Gato",
          "pet_age": "36 Meses",
          "sex": "Macho",
          "color": "Branco",
          "image_url": "xxxxx"
    }

    const res = await request(server.app).post('/api/animals').send(NewData)
    expect(res.statusCode).toEqual(201)
    expect(res.body).toEqual(NewData)
  })

})


describe('The API on /api/animals/:id Endpoint at PATCH method should...', () => {
  beforeAll(() => {
    populateDB(Data)
  })
  afterAll(() => cleanDB())

  test(`return 200 as status code and update the data by id `, async () => {
    expect.assertions(2)
    const res = await request(server.app).patch('/api/animals/ANI1580216220549RD493').send({"color": "Laranja"})
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      "created_at": "2020-01-28T12:57:00.550Z",
      "updated_at": "2020-01-28T12:57:00.550Z",
      "pet_name": "Tereza Fernandes Montalvão",
      "description": "Gatinha mais perfeita desse mundão redondo",
      "animal_type": "Gato",
      "pet_age": "6 Meses",
      "sex": "Fêmea",
      "color": "Laranja",
      "image_url": ""
    })
  })

  test(`return 404 as status code and update the data by id `, async () => {
    expect.assertions(2)
    const res = await request(server.app).patch('/api/animals/ERROR123456789').send({"color": "Laranja"})
    expect(res.statusCode).toEqual(404)
    expect(res.body).toEqual({ error: `The record ERROR123456789 couldn't be found.` })
  })

})


describe('The API on /api/animals/:id Endpoint at DELETE method should...', () => {
  beforeAll(() => {
    populateDB(Data)
  })
  afterAll(() => cleanDB())

  test(`return 200 as status code and deleted data by id `, async () => {
    expect.assertions(2)
    const res = await request(server.app).delete('/api/animals/ANI1580216220549RD493')
    const database = await animals.findAll()
    expect(res.statusCode).toEqual(204)
    expect(database).toEqual({"ANI1580214599567RD121": {
      "created_at": "2020-01-28T12:29:59.567Z",
      "updated_at": "2020-01-28T12:29:59.567Z",
      "pet_name": "Belchior Fernandes Montalvão",
      "description": "Gatinho mais fofinho desse mundo",
      "animal_type": "Gato",
      "pet_age": "6 Meses",
      "sex": "Macho",
      "color": "Branco Malhado",
      "image_url": ""
    }})
  })

  test(`return 404 as status code with wrong id `, async () => {
    expect.assertions(2)
    const res = await request(server.app).delete('/api/animals/ERROR123456789')
    expect(res.statusCode).toEqual(404)
    expect(res.body).toEqual({ error: `The record ERROR123456789 couldn't be found.` })
  })

})

describe('Test Writing in DB...', () => {
  beforeAll(() => {
    populateDB(Data)
  })
  afterAll(() => cleanDB())


  test(`return error when we try to update DB  `, async () => {
    const errUpdate = updateTest.updateDB('oi','../../data/database.test.xml`')
    expect(errUpdate).toEqual(`Couldn't update database.test.json`)
  })

})

