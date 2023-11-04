const express = require('express')
var morgan = require('morgan')
const cors = require('cors')

const date = new Date()

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


phoneBook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response)=>{
    response.json(phoneBook);
})

app.get('/info', (request, response) => {
    response.send(
        `<p>PhoneBook has info of ${phoneBook.length}</p>
        <p>${date}</p>`
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const entry = phoneBook.find((ele) => ele.id === id)
    if (entry) {
        response.json(entry)
    }
    else{
        response.status(404).json({error: "requested id not found"})
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    phoneBook = phoneBook.filter((ele) => {
        return ele.id !== id;         
    })

    response.json({
        delete: "success"
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body;
    if(!body.name){
        response.status(400).json({error: "Name is missing"})
        return
    }

    if(phoneBook.find(ele  => ele.name.toLowerCase() === body.name.toLowerCase())){
        response.status(409).json({error: "This name already exists"})
        return
    }

    const new_entry = {
        ...body,
        id: Math.floor(Math.random() * 10000)
    }
    phoneBook.push(new_entry)
    response.json(new_entry)
})



const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})