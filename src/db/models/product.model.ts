import mongoose from "mongoose"

const ProductSchema = new mongoose.Schema({
    name:{type:String, required:true},
    price:{type:Number, requires:true},
    quantity:{type:Number, requires:true}
})

export const Product = mongoose.model("Product",ProductSchema)