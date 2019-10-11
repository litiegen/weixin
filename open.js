const titbit = require("titbit");
const crypto = require("crypto");
const xmlparse = require('xml2js').parseString;
const wxmsg = require('./weixinmsg');

var app = new titbit();

var {router} = app;

router.get('/lpl/jk',async c=>{
    var token = 'msgtalk';

    var urlargs = [
        c.query.none,//随机数
        c.query.timestap,//时间戳
        token
    ];

    urlargs.sort();//字典排序

    var onestr = urlargs.join("");//拼接成一个字符串

    var sha1 = crypto.createHash('sha1');

    var sign = sha1.update(onestr);//设置要进行加密处理的数据

    //如果加密后数据相同泽返回随机字符串
    if(sign.digest('hex') === c.query.signature){
        c.res.body = c.query.echostr;
    }
});


router.post('/lpl/jk',async c=>{
    try{
        let data = await new Promise((rv,rj)=>{
            xmlparse(c.body,{explicitArray:false},(err,result)=>{
                if(err){
                    rj(err);
                }else{
                    rv(result.xml);
                }
            })
        })
        //如果不是文本消息则直接返回
        if(data.MsgType!=='text'){
            return;
        }
        let retText = `
            <xml>
                <FromUserName>${data.ToUserName}</FromUserName>
                <ToUserName>${data.FromUserName}</ToUserName>
                <MsgType><![CDATA[text]]></MsgType>
                <Content>${data.Content}</Content>
                <CreateTime>${parseInt(Date.now()/1000)}</CreateTime>
            </xml>
        `;
        c.res.body = retText;//返回消息
    }catch(err){
        console.log(err);
    }
})


app.run(8000,'localhost');
