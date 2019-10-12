const express = require('express')
const multer = require('multer')
const crypto = require('crypto')
const util = require('util')
const writeFile = util.promisify(require('fs').writeFile)
const mkdir = util.promisify(require('fs').mkdir)
const readFile = util.promisify(require('fs').readFile)
const { exec } = require('child_process')

const app = express()
const upload = multer()

app.post('/compile', upload.single('file'), async (req, res, next) => {
  const id = crypto.randomBytes(16).toString('hex')
  console.log('### New file upload. id:', id)
  const fileBuffer = Buffer.from(req.body.file, 'hex')
  const fileBuffer2 = Buffer.from(req.body.file2, 'hex')
  const { body: { fileName, fileName2 }} = req
  await mkdir(id)
  await writeFile(`${id}/${fileName}`, fileBuffer)
  await writeFile(`${id}/${fileName2}`, fileBuffer2)
  exec(`contract_path=${process.cwd()}/${id}/${fileName} id=${id} contract_name=${fileName} . ./compile.sh`, async (err, stdout, stderr) => {
    console.log(err)
    console.log(stderr)
    console.log(stdout)

    const wasmFile = await readFile(`${id}/contract_name.out.wasm`)
    const jsFile = await readFile(`${id}/contract_name.out.js`)
    res.send(JSON.stringify({
      wasmFile: wasmFile.toString('hex'),
      jsFile: jsFile.toString('hex')
    }))
  })

})


app.listen('7050', () => {
  console.log('http server listening on port 7050')
})
