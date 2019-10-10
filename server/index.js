const express = require('express')
const multer = require('multer')
const { exec } = require('child_process')
const crypto = require('crypto')
const util = require('util')
const writeFile = util.promisify(require('fs').writeFile)
const mkdir = util.promisify(require('fs').mkdir)

const upload = multer({ dest: 'uploads/' })

const app = express()

app.post('/compile', upload.single('file'), async (req, res, next) => {
  const id = crypto.randomBytes(16).toString('hex')
  console.log('### New file upload. id:', id)
  const fileBuffer = Buffer.from(req.body.file, 'hex')
  await mkdir(id)
  await writeFile(`${id}/${req.body.fileName}`, fileBuffer)
})


app.listen('7050', () => {
  console.log('http server listening on port 7050')
})
