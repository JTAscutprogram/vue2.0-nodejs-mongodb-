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
      <a href="javascript:void(0)" class="price">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
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
                  <a href="javascript:;" class="btn btn--m">加入购物车</a>
                </div>
              </div>
            </li>
            
           
            
          </ul>
        </div>
      </div>

    </div>
  </div>
</div>
      <div class = "md-overlay" v-show ="overLayFlag" @click="closePop" ></div>
    <nav-footer></nav-footer>
  </div>
</template>
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
            priceFilter:[                       //用于存放过滤器结构
              {
                startPrice:'0.00',
                endPrice:'500.00'
              },
              {
                startPrice:'500.00',
                endPrice:'1000.00'
              },
              {
                startPrice:'1000.00',
                endPrice:'1500.00'
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
       getGoodsList(){
          axios.get('/goods').then((response)=> {
            var res  =response.data; 
            if(res.status == '0'){
              this.goodslist = res.result.list;
            }else{
              this.goodslist = [];
            }
            console.log(this.goodslist);
            
          });
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
         this.closePop();
       }
     }
}
</script>
