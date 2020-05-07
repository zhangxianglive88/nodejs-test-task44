var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url
  var queryString = ''
  if (pathWithQuery.indexOf('?') >= 0) { queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /******** 从这里开始看，上面不要看 ************/

  console.log('有个傻子发请求过来啦！路径（带查询参数）为：' + pathWithQuery)

  if (path === '/') {
    let string = fs.readFileSync('./index.html', 'utf8')
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html; charset=utf-8')
    response.write(string)
    response.end()
  } else if (path === '/sign_up' && method === 'GET') {
    let string = fs.readFileSync('./sign_up.html', 'utf8')
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html; charset=utf-8')
    response.write(string)
    response.end()
  } else if (path === '/sign_up' && method === 'POST') {
      readBody(request)
      .then((body)=>{  // body email=1&password=2&password_confirmation=3
        let strings = body.split('&') // ['email=1', 'password=2', 'password_confirmation=3']
        let hash = {}
        strings.forEach(element => {
          let parts = element.split('=')  // ['email', '1']
          let key = parts[0]
          let value = parts[1]
          hash[key] = value        })
        let {email, password, password_confirmation} = hash
        if(email.indexOf('@') === -1){
          response.statusCode = 400
          response.setHeader('Content-Type', 'application/json; charset=utf-8')
          response.write(`{
            "errors":{
              "email": "invalid"
            }
          }`)
        }else if(password !== password_confirmation){
          response.statusCode = 400
          response.write(`password not match`)
        }else{
          response.statusCode = 200
        }
        response.end()
      })  
  } else if (path === '/main.js') {
    let string = fs.readFileSync('./main.js', 'utf8')
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/javascript; charset=utf-8')
    response.write(string)
    response.end()
  } else if (path === '/xxx') {
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/json')
    response.write(`
    {
      "note":{
        "to":"jack",
        "from":"john",
        "heading":"打招呼",
        "body":"你好"
      }
    }
    `)
    response.end()
  } else {
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html; charset=utf-8')
    response.write(`
    {
      "error":"失败！"
    }
    `)
    response.end()
  }


  /******** 代码结束，下面不要看 ************/
})

// 获取客户端传来的第四部分数据
function readBody(request){
  let body = [] // 请求体
  return new Promise((resolve, reject)=>{
      request.on('data', (chunk) => {  //request监听data事件，每次客户端传来一小块数据
        body.push(chunk)
      }).on('end', () => {  //当数据全部上传之后，就可以得到传递过来的所有数据啦
        body = Buffer.concat(body).toString()
        resolve(body)
      })
  })
}

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)


