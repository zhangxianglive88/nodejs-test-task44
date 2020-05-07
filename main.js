window.jQuery = function(nodeOrSelector){
    let nodes = {}
    nodes.addClass = function(){}
    nodes.html = function(){}
    return nodes
}
window.$ = window.jQuery

// 先要创建一个jQuery对象，不然会提示undefined，然后在这个对象上创建一个属性ajax，
// 而这个ajax是一个函数，也就是下面要实现的一个函数
window.jQuery.ajax = function({method, url}){
    return new Promise(function(resolve, reject){
        let request = new XMLHttpRequest(); 
        request.open(method, url) 
        request.onreadystatechange = ()=>{  // 捕捉readyState的状态变化
            if(request.readyState === 4){
                if(request.status >= 200){
                    resolve.call(undefined, request.responseText)
                }else if(request.status >= 400){
                    reject.callback(undefined, request)
                }
            }
        }
        request.send()
    }) 
}

myButton.addEventListener('click', ()=>{
    // 自己封装
    $.ajax({   // $.ajax返回的是一个promise对象
        method:'post',
        url:'/xxx',
    }).then(
        (text)=>{console.log(text)},
        (request)=>{console.log(request)}
    )

    // jQuery工具
    // $.ajax({   // $.ajax返回的是一个promise对象
    //     method:'post',
    //     url:'/xxx',
    // }).then(
    //         (responseText)=>{
    //             console.log(responseText)  //返回的是一个object，jQuery自动将服务器响应的json格式的字符串转换成object
    //             return '成功'
    //         },
    //         (request)=>{
    //             console.log(`error1`)
    //             return '已经处理'
    //         }
    //     ).then(        
    //         (上一次的处理结果)=>{console.log(上一次的处理结果)},
    //         (request)=>{console.log(`error2`)}
    //     )
})