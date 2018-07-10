// 引入http模块
let http=require('http');

// 引入路径模块
let path=require('path');
// 引入文件模块
let fs=require('fs');
// 引入请求头格式,第三方插件
let mime=require('mime');
// 引入查询字符串模块
let querystring=require('querystring');

// 创建文件根目录
let rootPath=path.join(__dirname,'www');

// 创建web服务
http.createServer((request,response)=>{   
    // 根据url请求，生成绝对路径 querystring.unescape()把url里的中文编码解码
    let filePath=path.join(rootPath,querystring.unescape(request.url));
    // 判断有没有文件
    let fsExists=fs.existsSync(filePath);
    console.log(filePath);
    if(fsExists){
        // 生成目录列表
        fs.readdir(filePath,(err,files)=>{
            
            if(err){
                // 进来这里，说明是文件
                
                fs.readFile(filePath,(err,data)=>{
                    response.writeHead(200,{
                        'content-type':mime.getType(filePath)
                    })
                    response.end(data);
                })
            }else{
                // 进来这里，说明是文件夹
                //有首页，直接去首页
                if(files.indexOf('index.html')!=-1){
                    
                    fs.readFile(path.join(filePath,'index.html'),(err,data)=>{
                        response.end(data);
                    })
                }else{
                    // 遍历出文件
                    let datastr='';
                    
                    for(let i=0;i<files.length;i++){
                        datastr+=`<h2><a href='${request.url=='/'?'':request.url}/${files[i]}'>${files[i]}</a></h2>`;
                    }
                    response.writeHead(200,{
                        // 判断是什么文件，设置什么格式的请求头
                        'content-type':'text/html;charset=utf-8'
                    });
                    response.end(datastr);
                }
                
            }
        })
    }else{
        // 没有文件，404
        response.writeHead(404,{
            'content-type':'text/html;charset=utf-8'
        });
        response.end(`<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
        <html><head>
        <title>404 Not Found</title>
        </head><body>
        <h1>Not Found</h1>
        <p>The requested URL /hjbyuhjbghbn was not found on this server.</p>
        </body></html>
        `)
    };

   
}).listen(80,'127.0.0.1',()=>console.log('开始监听'));
