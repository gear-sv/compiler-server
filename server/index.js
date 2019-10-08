const express = require('express')
const busyboy = require('connect-busyboy')

const app = express()
app.use(busyboy())

app.route('/upload')
  .post((req, res, next) => {
    console.log(req)
  })
