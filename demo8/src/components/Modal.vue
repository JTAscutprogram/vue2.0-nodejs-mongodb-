<template>
    <div>
        <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':mdShow}">
          <div class="md-modal-inner">
            <div class="md-top">
              
              <button class="md-close" @click="closeModal">Close</button>
            </div>
            <div class="md-content">
                <slot name ="message"></slot>
              <div class="btn-wrap">
                <slot name = "btnGroup"></slot>
              </div>
            </div>
          </div>
        </div>
        <div class="md-overlay" v-if="mdShow" @click="closeModal"></div>
    </div>
</template>

<style>

</style>

<script>
export default {
  props:["mdShow"],
    data(){
        return{
            msg:''
        }
    },
    methods:{
      closeModal(){
        //子组件的通信作用是通知父组件事件触发
        this.$emit("close");//触发父组件的close事件 例如goodslist中的close事件
        //trigger("click");   //这是触发方式，cilck
      }
    }
}
</script>
