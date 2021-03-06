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

/* COMPILE */

app.post('/emcc', upload.single('file'), async (req, res, next) => {
  try {
    const { id, fileName, fileBuffer, fileName2, fileBuffer2 } = parse(req)
    console.log('### Uploaded new code. id:', id)
    await write(id, fileName, fileBuffer, fileName2, fileBuffer2)
    await emcc(id, fileName)
    const response = await read(id, fileName)
    res.send(response)
    await clean(id)
    console.log('### Deleted compiled code. id:', id)
  } catch (error) {
    next(error)
  }
})

/* HEALTH CHECKS */

app.get('/healthz', (req, res, next) => {
  res.json({status: 'UP'})
})

/* UTILS */

const parse = (req) => {
  const id = crypto.randomBytes(16).toString('hex')
  const fileBuffer = Buffer.from(req.body.file, 'hex')
  const fileBuffer2 = Buffer.from(req.body.file2, 'hex')
  const { body: { fileName, fileName2 }} = req
  return {
    id,
    fileName,
    fileBuffer,
    fileName2,
    fileBuffer2
  }
}

const write = async (id, fileName, fileBuffer, fileName2, fileBuffer2) => {
  await mkdir(id)
  await writeFile(`${id}/${fileName}`, fileBuffer)
  await writeFile(`${id}/${fileName2}`, fileBuffer2)
}

const emcc = (id, fileName) => new Promise((resolve, reject) => {
  const contractPath = `${process.cwd()}/${id}/${fileName}`
  const contractName = `${fileName.slice(0, -4)}.out.js`
  exec(
    `contract_path=${contractPath} id=${id} contract_name=${contractName} . ./compile.sh`,
  (err, stdout, stderr) => {
    if (err) reject(err)
    if (stderr) console.log(stderr)
    console.log(stdout)
    resolve(true)
  })
})

const read = async (id, fileName) => {
  const name = fileName.slice(0, -4)
  const wasmFile = await readFile(`${id}/${name}.out.wasm`)
  const jsFile = await readFile(`${id}/${name}.out.js`)
  return JSON.stringify({
    wasmFile: wasmFile.toString('hex'),
    jsFile: jsFile.toString('hex')
  })
}

const clean = (id) => new Promise((resolve, reject) => {
  exec(`rm -rf ${process.cwd()}/${id}`,
  (err, stdout, stderr) => {
    if (err) reject(err)
    if (stderr) console.log(stderr)
    console.log(stdout)
    resolve(stdout)
  })
})


app.listen('7050', () => {
  console.log('http server listening on port 7050')
})
