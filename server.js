const express = require('express')
const morgan = require('morgan')

const app = express()
const port = 8000

app
  .use(morgan('dev'))
  .use(express.static('./'))

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'))

app.listen(port, () => console.log(`App listening on port ${port}!`))
