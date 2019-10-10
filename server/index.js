const express = require('express')
const multer = require('multer')
const crypto = require('crypto')
const util = require('util')
const writeFile = util.promisify(require('fs').writeFile)
const mkdir = util.promisify(require('fs').mkdir)
const { exec } = require('child_process')


const app = express()
const upload = multer()

app.post('/compile', upload.single('file'), async (req, res, next) => {
  const id = crypto.randomBytes(16).toString('hex')
  console.log('### New file upload. id:', id)
  const fileBuffer = Buffer.from(req.body.file, 'hex')
  const { body: { fileName }} = req
  await mkdir(id)
  await writeFile(`${id}/${fileName}`, fileBuffer)
  exec(`contract_path=${process.cwd()}/${id}/${fileName} id=${id} contract_name=${fileName} . ./compile.sh`, (err, stdout, stderr) => {
    console.log(err)
    console.log(stderr)
    console.log(stdout)
  })

})


app.listen('7050', () => {
  console.log('http server listening on port 7050')
})
