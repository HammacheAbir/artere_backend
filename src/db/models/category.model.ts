import mongoose from "mongoose"

const CategorySchema = new mongoose.Schema({
    name:{type:String, required:true},
    description:{type:String},
    subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false }],
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false }]
})

export const Category = mongoose.model("Category",CategorySchema)