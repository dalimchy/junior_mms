var express = require('express');
var router = express.Router();
const uuidv4 = require('uuid/v4');
var mongoosePaginate = require('mongoose-paginate');

const Appearance = require('../models/Appearance');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Tag = require('../models/Tag');

// schema.plugin(mongoosePaginate);

var addMenu =(data,callback)=>{
    var appearance_id = uuidv4();
    var menuData = {
        appearance_id: appearance_id,
        appearance_type: data.appearance_type,
        menu_title : data.menu_title,
        assign_menu : data.assign_menu,
        menu_icon : data.menu_icon,
        status : data.status
    }
    var newMenu = new Appearance(menuData);
    newMenu.save().then(res =>{
        callback({msg:'success',data:menuData});
    })
    .catch(err => console.log(err));
}
var addSlider =(data,callback)=>{
    var appearance_id = uuidv4();
    var sliderData = {
        appearance_id: appearance_id,
        appearance_type: data.appearance_type,
        slider_heading : data.slider_heading,
        slider_desc : data.slider_desc,
        slider_img : data.slider_img,
        assign_slider : data.assign_slider,
        status : data.status
    }
    var newSlider = new Appearance(sliderData);
    newSlider.save().then(res =>{
        callback({msg:'success',data:sliderData});
    })
    .catch(err => console.log(err));
}
var findAppearance =(data,callback)=>{
    Appearance.find({appearance_type:data.type}).sort({created_at: 'desc'}).exec(function (err, docs) {
        if(err){
            console.log(err);
        }else{
            callback({msg:'success',resdata:docs});
        }
    });

}

var appearance_update = (data,callback)=>{
    if(data.type == 'status'){
        Appearance.updateOne({appearance_id : data.id}, {status :data.value}, (err,result)=>{
            if(err){
                console.log(err);
            }else{
                callback({msg:'success',data:result});
            }
        })
    }
}
var appearance_delete = (data,callback)=>{
    Appearance.deleteOne({appearance_id : data.id}, (err,result)=>{
        if(err){
            console.log(err);
        }else{
            callback({msg:'success',data:result});
        }
    })
}

var findCategory =(callback)=>{
    Category.find().sort({created_at: 'desc'}).exec(function (err, docs) {
        if(err){
            console.log(err);
        }else{
            callback({msg:'success',resdata:docs});
        }
    });

}

var category_update = (data,callback)=>{
    if(data.type == 'status'){
        Category.updateOne({category_id : data.id}, {status :data.value}, (err,result)=>{
            if(err){
                console.log(err);
            }else{
                callback({msg:'success',data:result});
            }
        })
    }
}

var category_delete = (data,callback)=>{
    Category.deleteOne({category_id : data.id}, (err,result)=>{
        if(err){
            console.log(err);
        }else{
            callback({msg:'success',data:result});
        }
    })
}

var addCategory = (data,callback)=>{
    var category_id = uuidv4();
    var data = {
        category_id: category_id,
        category_type: data.category_type,
        category_name : data.category_name,
        category_desc : data.category_desc,
        category_icon : data.category_icon,
        category_image : data.category_image,
        parent_category_id : data.parent_category_id,
        parent_menu_id : data.parent_menu_id,
        status : data.status
    }
    var newCategory = new Category(data);
    newCategory.save().then(res =>{
        callback({msg:'success',data:data});
    })
    .catch(err => console.log(err));
}

var findSubCategory = (data,callback)=>{
    Category.find({ parent_category_id: data }, (err,docs)=>{
        if(err){
            console.log(err);
        }else{
            callback(docs);
        }
    });
}

var addNewProduct = (data,callback)=>{
    var newProduct = new Product(data);
    newProduct.save().then(res =>{
        callback({msg:'success',data:data});
    })
    .catch(err => console.log(err));
}

var findPaginateProduct = (data,callback)=>{
    Product.paginate({}, { page: data.pageNumber, limit: data.dataLimit,sort:{ created_at: 'desc' } }, function(err, result) {
        if(err){
            console.log(err);
        }else{
            callback({msg:'success',data:result});
        }
    });
}

var updateProduct = (data,callback)=>{
    if(data.type == 'status'){
        Product.updateOne({product_id : data.id}, {status :data.status}, (err,result)=>{
            if(err){
                console.log(err);
            }else{
                callback({msg:'success',data:result});
            }
        })
    }
}

var removeProduct = (data,callback)=>{
    if(data !== ''){
        Product.deleteOne({product_id:data.id},(err,result)=>{
            if(err){
                console.log(err);
            }else{
                callback({msg:'success'});
            }
        })
    }
}

var addTag = (data,callback)=>{
    if(data.tag_id !== ''){
        var newTag = new Tag(data);
        newTag.save().then(res =>{
            callback({msg:'success',data:data});
        })
        .catch(err => console.log(err));
    }
}
var allTag = (callback)=>{
    Tag.find().sort({created_at: 'desc'}).exec(function (err, docs) {
        if(err){
            console.log(err);
        }else{
            callback({msg:'success',resdata:docs});
        }
    });
}
var removeTagOne = (data,callback)=>{
    if(data !== ''){
        Tag.deleteOne({tag_id:data.id},(err,result)=>{
            if(err){
                console.log(err);
            }else{
                callback({msg:'success'});
            }
        })
    }
}

var findProductOne = (data,callback)=>{
    if(data !== ''){
        Product.findOne({product_id:data},(err,result)=>{
            if(err){
                console.log(err);
            }else{
                callback({msg:'success',resData:result});
            }
        })
    }
}

module.exports = {
    addMenu,
    addSlider,
    addCategory,
    findAppearance,
    appearance_update,
    appearance_delete,
    findCategory,
    category_delete,
    category_update,
    findSubCategory,
    addNewProduct,
    findPaginateProduct,
    updateProduct,
    removeProduct,
    addTag,
    allTag,
    removeTagOne,
    findProductOne
};
