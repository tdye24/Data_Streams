var PORT = 8080;                 //监听8080端口号
var http = require('http');  
var qs = require('qs');
var TOKEN = 'ecust2016';           //必须与测试号所填写的Token相同
var xml2js = require('xml2js');
let like_count = 0;
var xmlParser = new xml2js.Parser({explicitArray : false, ignoreAttrs : true});

function checkSignature(params,token){
    var key = [token,params.timestamp,params.nonce].sort().join(''); 
     //将token （自己设置的） 、timestamp（时间戳）、nonce（随机数）三个参数进行字典排序
    var sha1 = require('crypto').createHash('sha1');
     //将上面三个字符串拼接成一个字符串再进行sha1加密
    sha1.update(key);
    return sha1.digest('hex') == params.signature;
     //将加密后的字符串与signature进行对比，若成功，返回echostr
}


function like(xml) {
    like_count += 1;
    var reply = '';
    var ToUserName = xml.FromUserName;
    var FromUserName = xml.ToUserName;
    var CreateTime = parseInt(new Date().getTime()/1000);
    var MsgType = 'text';
    var Content = `感谢您的支持，当前赞数` + like_count;

    reply += `<xml> <ToUserName>`+ ToUserName + `</ToUserName> <FromUserName>` + FromUserName + `</FromUserName> <CreateTime>` + CreateTime + `</CreateTime> <MsgType>` + MsgType + `</MsgType> <Content>` + Content + `</Content> </xml>`;
    return reply;
}

function info(xml) {
    var reply = '';
    var ToUserName = xml.FromUserName;
    var FromUserName = xml.ToUserName;
    var CreateTime = parseInt(new Date().getTime()/1000);
    var MsgType = 'text';
    var Content = `欢迎关注DataStreams，上海图书馆2018数据开发竞赛中数据暗流团队作品。我们致力于数据查询，为使用者提供主题查询。
目前公众号处于起步建设阶段，让我们敬请期待更多查询主题，为“查有所得”而努力。`  +  `点击菜单进入主题查询，或回复相应数字进入主题查询：1： 诗词 2: 人物 3: 古籍 4: 朝代 5: 地点`;

    reply += `<xml> <ToUserName>`+ ToUserName + `</ToUserName> <FromUserName>` + FromUserName + `</FromUserName> <CreateTime>` + CreateTime + `</CreateTime> <MsgType>` + MsgType + `</MsgType> <Content>` + Content + `</Content> </xml>`;
    return reply;
}

function tips(xml) {
    var reply = '';
    var ToUserName = xml.FromUserName;
    var FromUserName = xml.ToUserName;
    var CreateTime = parseInt(new Date().getTime()/1000);
    var MsgType = 'text';
    var Content = `点击菜单进入主题查询，或回复相应数字进入主题查询：1： 诗词 2: 人物 3: 古籍 4: 朝代 5: 地点`;

    reply += `<xml> <ToUserName>`+ ToUserName + `</ToUserName> <FromUserName>` + FromUserName + `</FromUserName> <CreateTime>` + CreateTime + `</CreateTime> <MsgType>` + MsgType + `</MsgType> <Content>` + Content + `</Content> </xml>`;
    return reply;
} 

function aboutUs(xml) {
    var reply = '';
    var ToUserName = xml.FromUserName;
    var FromUserName = xml.ToUserName;
    var CreateTime = parseInt(new Date().getTime()/1000);
    var MsgType = 'news';
    var title1 = 'DataStreams';
    var description1 = '我们是华东理工大学数据暗流团队！';
    var pic1url = 'http://www.datastreams.club:3000/images/pic2.png';
    var url1 = 'http://www.datastreams.club:3000/aboutUs.html';

    reply +=
            `<xml>
                <ToUserName>` + ToUserName +  `</ToUserName>
                <FromUserName>` + FromUserName + `</FromUserName>
                <CreateTime>` + CreateTime + `</CreateTime>
                <MsgType>` + MsgType + `</MsgType>
                <ArticleCount>` + 1 +  `</ArticleCount>
                <Articles>
                    <item>
                        <Title>` + title1 + `</Title> 
                        <Description>` + description1 + `</Description>
                        <PicUrl>` + pic1url + `</PicUrl>
                        <Url>` + url1 + `</Url>
                    </item>
                </Articles>
            </xml>`
    return reply;
} 


function sendUrl(url, xml) {
    var reply = '';
    var ToUserName = xml.FromUserName;
    var FromUserName = xml.ToUserName;
    var CreateTime = parseInt(new Date().getTime()/1000);
    var MsgType = 'text';
    var Content = url;

    reply += `<xml> <ToUserName>`+ ToUserName + `</ToUserName> <FromUserName>` + FromUserName + `</FromUserName> <CreateTime>` + CreateTime + `</CreateTime> <MsgType>` + MsgType + `</MsgType> <Content>` + Content + `</Content> </xml>`;
    return reply;
}

var server = http.createServer(function (request,response) {
    var query = require('url').parse(request.url).query;
    var params = qs.parse(query);

    // console.log(params);
    // console.log("token :",TOKEN);

    if(!checkSignature(params,TOKEN)){
        //如果签名不对，结束请求并返回
        response.end('signature fail');
    }

    if (request.method == "GET") {
        console.log('这是一个get请求！');
        //如果请求是GET，返回echostr用于通过服务器有效校验
        // xmlParser.parseString(params.echostr, function(err, result) {
        //     if(err) {
        //         console.log('Error!');
        //     }else{
        //         console.log(result);
        //     }
        // });
        // response.end(result);
        response.end();
    }else{
        console.log('这是一个post请求！');
        //否则是微信给开发者服务器的POST请求
        var postdata = '';
        request.addListener("data",function(postchunk){
            postdata += postchunk;
        });

        //获取到了POST数据
        request.addListener("end",function(){
            xmlParser.parseString(postdata, function (err, result) {
                if(err) {
                    console.log('Error!');
                }else{
                    // //将返回的结果再次格式化
                    //  console.log(JSON.stringify(result));
                    if(result) {
                        switch(result.xml.MsgType) {
                            case 'event': {
                                switch(result.xml.Event) {
                                    case 'CLICK': {
                                        switch(result.xml.EventKey) {
                                            case 'good': {
                                                response.write(like(result.xml));
                                                break;
                                            };
                                            case 'about': {
                                                response.write(aboutUs(result.xml));
                                                break;
                                            };
                                            default: break;
                                        }
                                        break;
                                    };
                                    case 'VIEW': {
                                        break;
                                    };
                                    case 'subscribe': {
                                        response.write(info(result.xml));
                                        break;
                                    };
                                    default: break;
                                }
                                break;
                            };
                            case 'text': {
                                switch(result.xml.Content) {
                                    case '1': {
                                        response.write(sendUrl('http://www.datastreams.club:3000/poem.html', result.xml));
                                        break;
                                    };
                                    case '2': {
                                        response.write(sendUrl('http://www.datastreams.club:3000/character.html', result.xml));
                                        break;
                                    };
                                    case '3': {
                                        response.write(sendUrl('http://www.datastreams.club:3000/work.html', result.xml));
                                        break;
                                    };
                                    case '4': {
                                        response.write(sendUrl('http://www.datastreams.club:3000/dynasty.html', result.xml));
                                        break;
                                    };
                                    case '5': {
                                        response.write(sendUrl('http://www.datastreams.club:3000/place.html', result.xml));
                                        break;
                                    };
                                    default: response.write(tips(result.xml));
                                }
                                break;
                            };
                            default: break;
                        }

                    }
                }
              });
            response.end('success ');
        });
    }
});

server.listen(PORT, function () {
    console.log('Server running at port:' + PORT);
});
