'use strict'

const Hapi = require('hapi')
const Path = require('path')
const fsPromises = require('fs').promises

const port = process.env.PORT || 8000
const server = Hapi.server({port: port})

const init = async function() {
  await server.register(require('inert'));

  server.route([
    {
      method: 'GET',
      path: '/dist/{filename}',
      handler: {
        file: function (request) {
          return Path.join(__dirname, 'dist', request.params.filename)
        }
      }
    },
    {
      method: 'GET',
      path: '/config',
      handler: {
        file: Path.join(__dirname, 'dist', 'index.html')
      }
    },
    {
      method: 'GET',
      path: '/raw',
      handler: {
        file: Path.join(__dirname, 'twitter-config.json')
      }
    },
    {
      method: 'POST',
      path: '/config',
      handler: (request, h) => {
        let path = Path.join(__dirname, 'twitter-config.json')
        let payload = JSON.stringify(request.payload.data, null, 2)
        return fsPromises.writeFile(path, payload)
        .then(()=>{
          return h.response('success')
        })
        .catch(()=>{
          return h.response('error')
        })
      }
    }
  ])

  start()
}

const start = async function() {
  try {
    await server.start()
  }
  catch (err) {
    console.log(err)
    process.exit(1)
  }

  console.log('Server running at:', server.info.uri)
}

init()