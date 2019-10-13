const axios = require('axios')
const FormData = require('form-data')
const util = require('util')
const readFile = util.promisify(require('fs').readFile)
const writeFile = util.promisify(require('fs').writeFile)

const port = 7050

const test = (async () => {
  const cppFile = await readFile('tmp/FungibleToken.cpp')
  const hFile = await readFile('tmp/FungibleToken.h')
  const form = new FormData()
  form.append('file', cppFile.toString('hex'))
  form.append('fileName', 'FungibleToken.cpp')
  form.append('file2', hFile.toString('hex'))
  form.append('fileName2', 'FungibleToken.h')
  const response = await axios({
    method: 'post',
    url: `http://compile.gear.computer/emcc`,
    data: form,
    headers: {
      'content-type': `multipart/form-data; boundary=${form._boundary}`
    }
  })
  console.log("response", response)
  // const wasmFile = Buffer.from(response.body.wasmFile, 'hex')
  // const jsFile = Buffer.from(response.body.jsFile, 'hex')
  // console.log("wasmFile", wasmFile)
  // console.log("jsFile", jsFile)
  // await writeFile(`${process.cwd()}/output/${contractName}.cpp`, wasmFile)
  // await writeFile(`${process.cwd()}/output/${contractName}.js`, jsFile)

})()
