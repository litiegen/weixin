const gohttp = require("gohttp");
const wxkey = require("./wxkey");

var token_api = `https://api.weixin.qq.com/cgi-bin/token`+`?grant_type=client_credential`
                +`&appid=${wxkey.appid}&secret=${wxkey.secret}`;

var menu_data = {
    button:[
        {
            type: "pic_weixin", 
            name: "发图", 
            key: "rselfmenu_1_2" 
        },
        {
            name:"key",
            type:"click",
            key:"这是一个key值"
        },
        {
            name:"菜单",
            sub_button:[
                {
                    name:"百度搜索",
                    type:"view",
                    url:"https://www.baidu.com"
                },
                {
                    type: "pic_sysphoto", 
                    name: "拍照", 
                    key: "rselfmenu_1_0", 
                },
            ]
        }
    ]
};

(async()=>{

    let ret = await gohttp.get(token_api);
    let t = JSON.parse(ret);
    if(t.access_token === undefined){
        console.log(ret);
        process.exit(-1);
    }
    let create_menu_api = `https://api.weixin.qq.com/cgi-bin/menu/create`
                        +`?access_token=${t.access_token}`;
    ret = await gohttp.post(create_menu_api,{
        body:menu_data,
        headers:{
            'content-type':'text/plain'
        }
    });
    console.log(ret)
    // gohttp.get(token_api).then(data=>{
    //     console.log(data);
    // },err=>{
    //     console.log(err);
    // })
})();