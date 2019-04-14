
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
//router.get第一个参数为二级路由访问格式，第二个参数是回调，req res next查看官网API运用
router.get("/",function(req,res,next){
    //res.send("hello , good list ");
    
    //这里可以获取前端的排序参数，对数据进行处理
    //分页功能
    //通过前端请求头获取当前传入的参数一般都是通过url获取param 但是这里进行了封装
    //这里获取的是字符串格式，而下面的limit需要的是数字
    /*let page = parseInt(req.param("page"));  //获取当前第几页
    let pageSize = parseInt(req.param("pageSize"));  //获取页面大小（每页几个商品）
    var sort = parseInt(req.param("sort"));
    let skip  = (page-1)*pageSize;    //默认跳过skip条  Skip是一个索引值
    //page为1 skip跳过0条 limit每页几个组件比如说8
    //分页就是每页最多显示几条数据，比如每页都只能显示8条然后数据查询的时候就会跳过几条数据
    //page为2，skip跳过8条数据 因为前面8个数据已经被第一个page显示过了第二页从9开始拿数据
    let goodsModel =  Goods.find(params).skip(skip).limit(pageSize)
    let params = {};
    let goodsModel =  Goods.find(params);
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
                }
            })
        }

    })     */


    Goods.find( {} ,function(err,doc){   //查询数据库函数good.find()两个参数第一个为查询条件，第二个为回调函数
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


})
//这里一定要在底下module.exports输出当前的路由，如果不输出的话APP.use require得到的是空对象
module.exports = router;