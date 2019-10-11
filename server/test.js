const axios = require('axios')
const util = require('util')
const readFile = util.promisify(require('fs').readFile)
const FormData = require('form-data')

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
    url: `http://35.203.71.42:${port}/compile`,
    data: form,
    headers: {
      'content-type': `multipart/form-data; boundary=${form._boundary}`
    }
  })
  console.log("response", response)
})()
