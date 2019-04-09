const express = require('express')
const next = require('next')

const devProxy = {
  '/api': {
    target: 'http://localhost:8080/',
    pathRewrite: { '^/api': '' },
    changeOrigin: true,
  },
}

const port = process.env.NODE_ENV !== 'production' ? 3000 : (process.env.PORT || 5000)
const dev = process.env.NODE_ENV !== 'production'
const app = next({
  dir: '.',
  dev
})
const handle = app.getRequestHandler()



app.prepare().then(() => {
  const server = express()

  if (dev && devProxy) {
    const proxyMiddleware = require('http-proxy-middleware')
    Object.keys(devProxy).forEach(function (context) {
      server.use(proxyMiddleware(context, devProxy[context]))
    })
  }

  server.all('*', (req, res) => {
    req.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    req.headers['X-Requested-With'] = 'XMLHttpRequest';
    handle(req, res);
  })
  // server.get('*', (req, res) => {
  //   return handle(req, res)
  // })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
}).catch(err => {
  console.log('An error occurred, unable to start the server')
  console.log(err)
})
