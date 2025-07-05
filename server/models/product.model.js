import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true, trim: true },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    imageUrl: { type: String, required: true },
    inStock: { type: Boolean, default: true },
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

export default Product;
