<template>
    <div>
        <nav-header></nav-header>
          <nav-bread>
              <span>Goods</span>
          </nav-bread>
<div class="accessory-result-page accessory-page">
  <div class="container">
    <div class="filter-nav">
      <span class="sortby">Sort by:</span>
      <a href="javascript:void(0)" class="default cur">Default</a>
      <a @click ="sortGoods" href="javascript:;">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
      <a href="javascript:void(0)" class="filterby stopPop" @click ="showFilterPop">Filter by</a>
    </div>
    <div class="accessory-result">
      <!-- filter -->
      <!-- 响应式布局，当窗口小到一定程度 左边菜单会隐藏-->
      <div class="filter stopPop" id="filter" v-bind:class ="{'filterby-show':filterBy}">
        <dl class="filter-price">
          
          <dt>Price:</dt>
          <dd><a href="javascript:void(0)" v-bind:class ="{'cur':priceChecked == 'All'}">All</a></dd>
          <dd v-for ="(price,index) in priceFilter" >
            <a href="javascript:void(0)" @click="setPriceFilter(index)" 
            v-bind:class="{'cur': priceChecked == index}">{{price.startPrice}} - {{price.endPrice}}</a>
          </dd>
          
        </dl>
      </div>

      <!-- search result accessories list -->
      <div class="accessory-list-wrap"  >
        <div class="accessory-list col-4">
          <ul>
            <li  v-for="item in goodslist"  >
              <div class="pic">
                <a href="#">
                  <!-- 用v-lazy实现图片懒加载，在图片加载之前显示loading的图片，加载完成才显示真实图片-->
                  <!-- 懒加载还可以用于一个页面图片比较多，当没有滚动到图片时不会加载，滚动到才加载
                  这样不会一开始为了加载大量静态资源耗费不必要请求，
                  loading也会提升用户体验告诉用户资源正在加载-->
                  <img  v-lazy ="'/static/'+item.productImage" alt="">
                  </a>
              </div>
              <div class="main">
              
                <div class="name">{{item.productName}}</div>
                <div class="price">{{item.salePrice}}</div>
                <div class="btn-area">
                  <a href="javascript:;" class="btn btn--m" @click ="addCart(item.productId)">加入购物车</a>
                </div>
              </div>
            </li>
            
           
            
          </ul>
          <div class = "load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
              <img src="./../assets/loading-spinning-bubbles.svg" alt="">
          </div>
        </div>
      </div>

    </div>
  </div>
</div>
      <div class = "md-overlay" v-show ="overLayFlag" @click="closePop" ></div>
    <nav-footer></nav-footer>
  </div>
</template>
<style>
  .list-warp ul ::after{
    clear:both;
    content:'';
    height: 0;
    display: block;
    visibility: hidden;
  }
  .load-more{
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
</style>

<script>
//导入样式
    import "./../assets/css/base.css"; //assets和外面的static都是存放静态资源的
                                        //而assets存放组件的静态资源 static存放页面资源
                                        //如果图片资源够小 assets打包的时候回打包成base64位的数据
                                           
    import "./../assets/css/product.css";
    import NavHeader from '@/components/NavHeader';
    import NavFooter from '@/components/NavFooter';
    import NavBread from '@/components/NavBread';
    import axios from 'axios';
export default {
    
     data(){
         return{
            goodslist:[],                       //用于存放商品列表
            sortFlag:true,                      //用于排序
            page:1,                             //当前页面第几页，分页用
            pageSize:8,                         //页面大小
            loading:false,                      //加载图片，默认不显示，调用接口的时候显示
            busy:false,                         //用于分页vue-infinite-scroll滚动延迟加载判断
                                                //如果busy为false则说明滚动禁用，
            priceFilter:[                       //用于存放过滤器结构
              {
                startPrice:'0.00',
                endPrice:'100.00'
              },
              {
                startPrice:'100.00',
                endPrice:'500.00'
              },
              {
                startPrice:'500.00',
                endPrice:'1000.00'
              },
              {
                startPrice:'1000.00',
                endPrice:'5000.00'
              }
              
            ],
            priceChecked:'All',         //用于控制价格菜单选定状态
            filterBy:false,             //用于控制响应式布局时菜单的展现 ,绑定了
                                        // click并在methods的showFilterPop中实现控制
                                        //在closePop函数中也有

            overLayFlag:false            //用于控制响应式布局时菜单呈现的全局遮罩效果 ,绑定了
                                        // click并在methods的showFilterPop中实现控制
           
         }
     },
     components:{
         NavHeader,       //头部组件载入
         NavFooter,       //底部组件载入
         NavBread         //面包屑组件载入
     },
     mounted: function (){
        this.getGoodsList();
     },
     methods:{
       //通过axios获取本地测试数据
       getGoodsList(flag){
         var param = {
           page:this.page,
           pageSize:this.pageSize,
           priceLevel:this.priceChecked,
           sort:this.sortFlag?1:-1
         }
         this.loading = true;   //调用接口请求数据的时候显示加载
          axios.get('/goods',{
            params:param
          }).then((response)=> {
            this.loading = false; //请求数据完成 ，关闭加载显示
            var res  =response.data; 
            if(res.status == '0'){
              if(flag){
              this.goodslist = this.goodslist.concat( res.result.list);//累加页面的goodslist数据从零开始
                  if(res.result.count ==0){
                    this.busy = true; //如果是零条就把busy启动滚动分页
                  }else{
                    this.busy = false;
                  }
              }else{
                this.goodslist = res.result.list;   //第一次进入页面第一页 不需要数据拼接直接返回数据
                this.busy = false;
              }
            }else{
              this.goodslist = [];
            }
           // console.log(this.goodslist);
            
          });
       },
       //实现排序
       sortGoods(){
         
         this.sortFlag=!this.sortFlag;
         this.page = 1;
         this.getGoodsList();
        
       },
       //实现响应式布局页面缩放时点击价格过滤的视图呈现
       showFilterPop(){
         //通过在过滤菜单绑定filterBy和底部绑定overLatFrag两个布尔值控制
         this.filterBy = true;    //将值置为true表示点击的时候显示
         this.overLayFlag = true;  //实现遮罩
       },
       
       closePop(){
         this.filterBy = false;
         this.overLayFlag = false;
       },
       //选中价格菜单的某一价格
       setPriceFilter(index){
         this.priceChecked=index;
         
         this.page = 1;
         this.getGoodsList();
   
       },
       loadMore(){
         
         this.busy = true;
         setTimeout(()=>{
            this.page++; //实现分页
            this.getGoodsList(true); //这里page已经累加了会往另一页跳
         },500)
       },
        addCart(productId){
          axios.post("/goods/addCart",{
            productId:productId
          }).then((res)=>{
            if(res.status == '0'){
              console.log("succ");
            }else{
              console.log("msg:"+res.msg);
            }
          })
        }

     }
}
</script>
