var express = require('express');
var router = express.Router();
var User = require('./../models/user')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//设置user登录路由
router.post('/login',function(req,res,next){
  //获取前端post中的请求参数
  var param = {
    userName:req.body.userName,
    userPwd:req.body.userPwd
  }
  //获取user模型，查找数据表
  User.findOne (param,function(err,doc){
    //如果出错，返回报错信息
    if(err){
      res.json({
        status:'1',
        msg:"wrong user data"
      })

    }
    //如果成功找到用户
    else{
        if(doc){
          //服务器端设置cookie
          res.cookie("userId",doc.userId,{
            path:'/', //设置cookie存放路径，
            maxAge:1000*60*60 //设置cookie保存时间，单位为毫秒
          })
          res.cookie("userName",doc.userName,{
            path:'/', //设置cookie存放路径，
            maxAge:1000*60*60 //设置cookie保存时间，单位为毫秒
          })
          //req.session.user = doc;
          res.json({
            status:'0',
            msg:'',
            result:{
              userName:doc.userName
            }
          })
        }
    }
  })
})
//登出功能
router.post("/logout",function(req,res,next){
  res.cookie("userId","",{    //清除cookie
    path:'/',
    maxAge:-1
  })
  res.json({
    status:'0',
    msg:'',
    result:'logout success'
  })
})
//检测登录状态
router.get("/checkLogin",function(req,res,next){
  if(req.cookies.userId){
    res.json({
      status:'0',
      msg:'',
      result:req.cookies.userName || ''
     })
  }else{
    res.json({
      status:'1',
      msg:'未登录',
      result:''
    })
  }

})
//获取当前用户购物车列表
router.get("/cartList",function(req,res,next){
  var userId = req.cookies.userId;        //通过req对象的cookie获取用户ID
  User.findOne({userId:userId},function(err,doc){  //通过userId查询数据库表获取信息
        if(err){
          res.json({      //如果查询数据库出错
            status:'1',
            msg:err.message,
            result:''
          });
        }else{
           if(doc){   //如果商品数据获取成功
             res.json({
               status:'0',
               msg:'',
               result:doc.cartList
             })
           }
        }
  })
})
//购物车删除某条数据
router.post("/cartDelete",function(req,res,next){
 // console.log('post /cart/del suc');
  var userId = req.cookies.userId;  //获取用户ID
  var productId = req.body.productId;//获取删除的商品ID
 // console.log('post /cart/del suc'+userId);
 // console.log('post /cart/del suc'+productId);
  User.findOneAndUpdate(      //这里删除商品信息调用mongoose的update API具体用法如下
    {
      userId:userId,
    },
      {$pull:     //pull为删除
        {         //第二个参数为类似的删除条件，这里表示删除子文档cartList下productId为具体参数的某条数据
        cartList:{
        productId:productId 
      } 
    }
    },
//第一个参数找到collections文档这里找到userID的文档
    function (err,doc) {  //这是删除数据的回调
        if(err){  //失败的回调
          res.json({
            status:'1',
            msg:err.message,
            result:''
            
          })
        //  console.log('update err');
        }
        else{     //成功的回调
          //console.log('update suc');
          res.json({
            status:'0', 
            msg:'',
            result:'suc'
          })
        }
    }
  )
 
})

//修改购物车商品数量
router.post("/cartEdit",function(req,res,next){
  var userId = req.cookies.userId;
  var productId = req.body.productId;
  var productNum = req.body.productNum;
  var checked = req.body.checked;
  User.findOneAndUpdate(
    {userId:userId,"cartList.productId":productId},
    {'cartList.$.productNum':productNum,
    'cartList.$.checked':checked
  },
    function(err,doc){
      if(err){  //失败的回调
        res.json({
          status:'1',
          msg:err.message,
          result:''
          
        })
      //  console.log('update err');
      }
      else{     //成功的回调
        //console.log('update suc');
        res.json({
          status:'0', 
          msg:'',
          result:'suc'
        })
      }
    }
  )
})
//实现全选功能
router.post("/editCheckAll",function(req,res,next){
  var userId = req.cookies.userId;
  var checkAll = req.body.checkAll?'1':'0'; //先获取前端请求参数
  User.findOne({userId:userId},function(err,user){    //获取用户信息
    if(err){  //获取用户信息失败的回调
      res.json({
        status:'1',
        msg:err.message,
        result:''
        
      })
    //  console.log('update err');
    }
    else{     //获取用户信息成功的回调
      //console.log('update suc');
        if(user){   //成功获取 user内容
          user.cartList.forEach((item)=>{
            item.checked = checkAll;  //修改所有checked的值
          })
          user.save(function(err2,doc){
            if(err2){  //save保存数据库失败的回调
              res.json({
                status:'1',
                msg:err2.message,
                result:''
                
              })
            //  console.log('update err');
            }
            else{   //save保存数据库成功的回调
              res.json({
                status:'0',
                msg:'',
                result:'suc'
                
              })
            }
          })
        }
    }
  })
})
module.exports = router;
