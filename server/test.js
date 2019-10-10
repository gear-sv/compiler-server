const axios = require('axios')
const util = require('util')
const readFile = util.promisify(require('fs').readFile)
const FormData = require('form-data')

const port = 7050

const test = (async () => {
  const cppFile = await readFile('tmp/FungibleToken.cpp')
  const form = new FormData()
  form.append('file', cppFile.toString('hex'))
  form.append('fileName', 'FungibleToken.cpp')
  const response = await axios({
    method: 'post',
    url: `http://localhost:${port}/compile`,
    data: form,
    headers: {
      'content-type': `multipart/form-data; boundary=${form._boundary}`
    }
  })

})()
