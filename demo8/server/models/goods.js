var mongoose = require('mongoose');
//require是nodejs提供的类库 他会自动在node_modules中一层层的查找，所以不必指定路径
//mongo的使用可以查找mongoose的官网
var Schema = mongoose.Schema;
var productSchema = new Schema ({
    "productId":String,
    "productName":String,
    "salePrice":Number,
    "productImage":String,
});
//把model模型输出，输出之后可以调用API方法
module.exports = mongoose.model('Good',productSchema);
//mongodb这里module的时候关联good会自动加上S  自动关联goods的collection。
//所以建表的时候一定要在名词后加上s 