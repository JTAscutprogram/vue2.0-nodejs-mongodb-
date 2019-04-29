
var express = require('express');               //路由是通过express框架扩展出来的需要先拿到express
var router = express.Router();                  //获取expresss的路由（也可以用原生的）
var mongoose = require('mongoose');             //要操作数据库需要获取mongoose对象
var Goods = require('../models/goods');         //加载模型表，数据模型
//可以通过root验证连接,根据下行代码的root
//mongoose.connect('mongodb://root:123456@127.0.0.1:27017/imoocMall')

//正常的连接mongodb数据库
mongoose.connect('mongodb://127.0.0.1:27017/imoocMall');
//连接数据库之后可以监听数据库是否连接，和连接状态
//可以监听是否连接，如已连接
mongoose.connection.on("connected",function(){
    console.log("mongdb connected success");
});
//连接出错
mongoose.connection.on("error",function(){
    console.log("mongdb connected fail");
});
//连接已断开
mongoose.connection.on("disconnected",function(){
    console.log("mongdb disconnected success");
});
//获取路由访问"/"的时候获取商品数据
//router.get第一个参数为二级路由访问格式，第二个参数是回调，req res next查看官网API运用,
//这是获取商品信息以及分页功能，默认的goods功能
router.get("/list",function(req,res,next){
    //res.send("hello , good list ");
    
    //这里可以获取前端的排序参数，对数据进行处理
    //分页功能
    //通过前端请求头获取当前传入的参数一般都是通过url获取param 但是这里进行了封装
    //这里获取的是字符串格式，而下面的limit需要的是数字
    let page = parseInt(req.param("page"));  //获取当前第几页
    let priceLevel = req.param("priceLevel");
    console.log(priceLevel);
    let pageSize = parseInt(req.param("pageSize"));  //获取页面大小（每页几个商品）
    var sort = parseInt(req.param("sort"));
    let skip  = (page-1)*pageSize;    //默认跳过skip条  Skip是一个索引值
    //page为1 skip跳过0条 limit每页几个组件比如说8
    //分页就是每页最多显示几条数据，比如每页都只能显示8条然后数据查询的时候就会跳过几条数据
    //page为2，skip跳过8条数据 因为前面8个数据已经被第一个page显示过了第二页从9开始拿数据
    let params = {};
    var priceGt = '',priceLte = '';
    if(priceLevel != "All"){
        switch(priceLevel){
            case '0':priceGte = 0 ;priceLte = 100; break;
            case '1':priceGte = 100 ;priceLte = 500; break;
            case '2':priceGte = 500 ;priceLte = 1000; break;
            case '3':priceGte = 1000 ;priceLte = 5000; break;
        };
        params = {
            salePrice : {   //条件查询，传入查询参数gte大于等于，lte小于等于
                $gte:priceGte,
                $lte:priceLte
            }
        };
    };
    
    let goodsModel =  Goods.find(params).skip(skip).limit(pageSize);
   
    
    goodsModel.sort({'salePrice':sort});     //确定对哪个值升序降序(sort 1是升序 -1是降序)
    goodsModel.exec(function(err,doc){   //进行分页
        if(err){
            res.json({
                status:'1',
                msg:err.message
            });
            
        }
        else{
            res.json({
                status:'0',
                msg:'',
                result:{
                    count:doc.length,   //总条数
                    list:doc
                },
               

            })
        }

    })    
     
    
       /* 
    let GoodsModel =Goods.find( {} ,function(err,doc){   //查询数据库函数good.find()两个参数第一个为查询条件，第二个为回调函数
        if(err){
            res.json({
                status:'1',
                msg:err.message
            });
            
        }
        else{
            res.json({
                status:'0',
                msg:'',
                result:{
                    count:doc.length,   //总条数
                    list:doc
                }
            })
        }
    })   
   */


})

function createCartListItem(doc){
    var cartListItem = {
        "productId" : String,
        "productName" :String,
        "salePrice":String,
        "productImage":String,
        "checked":String,
        "productNum":String
    }
   
    cartListItem["productId"] = doc.productId;
    cartListItem["productName"] = doc.productName;
    cartListItem["salePrice"] = doc.salePrice;
    cartListItem["productImage"] = doc.productImage;
    cartListItem["productNum"] = '1';//用户选中的商品之后由于商品的数据没有数量字段这里默认加一个1
    cartListItem["checked" ]= '1'; 

    return cartListItem;
}

//加入到购物车功能
router.post("/addCart",function (req,res,text){
    var userId = '100000077'; //默认登录了，直接拿这个ID来用
    var productId = req.body.productId;     //获取通过post的产品ID，与 get不同可以通过params获取，post通过body
    var User = require('../models/user')
    //第一层回调，获取User信息，使用fineOne找到第一个和查询参数匹配的user信息
    User.findOne({userId:userId},function (err,userDoc){
        if(err){        //如果没拿到用户信息 出错
            res.json({
                status:'1',
                msg:err.message
            })
        }else{          //如果拿到用户信息
            //console.log("userDoc:" +userDoc);
            //console.log(productId);

            if(userDoc){
                let goodsItem = '';
                userDoc.cartList.forEach(item => {  //遍历cartList数组如果加入购物车的商品已经存在
                    if(item.productId == productId){
                        goodsItem = item;
                        item.productNum++;          //如果cartList已经存在了，只需要对productNum++就行了
                    }
                });
                if(goodsItem){      //如果购物车里存在商品，对num++后直接save
                                    //由于上面已经++过了 不需要加一操作直接save
                    userDoc.save(function (err1,doc1){
                        if(err1){
                            res.json({
                                status:'1',
                                msg:err1.message
                                
                            })
                           // console.log("userDoc save error");
                        }else{
                            res.json({
                                status:'0',
                                msg:'',
                                result:'success'
                            })
                          //  console.log("userDoc save success");
                        }
                    })
                }else{
                        //如果购物车里的cartList不存在该商品，需要push一次再save
                        //第二层回调，找到商品的信息，也是fineOne
                    Goods.findOne({productId:productId},function (err2,doc2){
                        if(err2){
                            res.json({
                                status:"1",
                                msg:err2.message
                            })
                        }
                        else{
                            if(doc2){
                                
                               //这里cartList里的good多了productNum与checked字段，
                               //所以需要对获取的goods json对象进行操作，这里用一个函数封装了
                                var cartListItem = createCartListItem(doc2);
                                console.log(cartListItem);
                                userDoc.cartList.push(cartListItem);  //加到user表中
                                //第三层回调
                                userDoc.save(function (err3,doc3){
                                    if(err3){
                                        res.json({
                                            status:'1',
                                            msg:err3.message
                                            
                                        })
                                       // console.log("userDoc save error");
                                    }else{
                                        res.json({
                                            status:'0',
                                            msg:'',
                                            result:'success'
                                        })
                                      //  console.log("userDoc save success");
                                    }
                                })
                            }
                        }
                    })
                }
                    
            }
        }
    })
})
//这里一定要在底下module.exports输出当前的路由，如果不输出的话APP.use require得到的是空对象
module.exports = router;