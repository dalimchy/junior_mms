var express = require('express');
var router = express.Router();



const Appearance = require('../models/Appearance');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Tag = require('../models/Tag');

var forntend = (callback)=>{
    var appFind = Appearance.find().sort({created_at: 'desc'});
    var cateFind = Category.find().sort({created_at: 'desc'});
    var tagFind = Tag.find().sort({created_at: 'desc'});
    var product = Product.find({status:1}).sort({created_at: 'desc'}).limit(200);
    
    appFind.exec(function (err, docs) {
        if(err){
            console.log(err);
        }else{
            cateFind.exec(function (err, docs2) {
                if(err){
                    console.log(err);
                }else{
                    tagFind.exec(function (err, docs3) {
                        if(err){
                            console.log(err);
                        }else{
                            product.exec(function(err,docs4){
                                if(err){
                                    console.log(err);
                                }else{
                                    callback({msg:'success',appearance:docs,category:docs2,tag:docs3,products:docs4});
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

module.exports = {forntend};