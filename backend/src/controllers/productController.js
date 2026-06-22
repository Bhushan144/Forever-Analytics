import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';

//function to add product 
const addProduct = async (req, res) => {
    try {
        //get the product details 
        const { name, description, price, category, subcategory, sizes, bestseller } = req.body;

        //here req.files.image1 is an array , if it exist then it's first value we are adding in image1 which is basically a image1 object
        const image1 = req.files.image1 && req.files.image1[0]; //complete image object of image1 which also has path 
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        //array of all image objects which are not undefined 
        const images = [image1, image2, image3, image4].filter((item) => {
            return (item !== undefined);
        })

        // uploadURL is an array of all URL of images after uploding on cloudinary
        const uploadURL = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path);
                return result.secure_url;
            })
        )

        console.log(uploadURL);
        const product = await new productModel({
            name,
            description,
            price: Number(price),
            category,
            subcategory,
            bestseller: (bestseller === "true") ? true : false,
            sizes: JSON.parse(sizes),
            image: uploadURL,
            date: Date.now()
        })

        const newProduct = await product.save();

        res.status(200).json({ success: true, message: "product added successfully", product: newProduct })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

//function to list product 
const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.status(200).json({ success: true, message: "products fetched successfully", products: products })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

//function to remove product 
const removeProduct = async (req, res) => {
    try {
        const { id } = req.body;

        //delete images of product from cloudinary
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "product does not exist." })
        }

        // Check if the product has an array of images
        if (product.image && Array.isArray(product.image) && product.image.length > 0) {
            // 1. Convert the array of image URLs into an array of public_ids.
            // The .filter(Boolean) will remove any null values if a URL was invalid.
            const publicIds = product.image.map(url => getPublicId(url)).filter(Boolean);

            // 2. If there are any valid public_ids, delete them all from Cloudinary
            //    in a single, more efficient API call.
            if (publicIds.length > 0) {
                await cloudinary.api.delete_resources(publicIds);
            }
        }

        await productModel.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Product deleted succesfully." })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const getPublicId = (url) => {
    if (!url) {
        return null;
    }

    // Split the URL by slashes
    const parts = url.split("/");

    // Find the segment that starts with 'v' followed by numbers (the version)
    const versionIndex = parts.findIndex(part => /^v\d+$/.test(part));

    // If no version segment is found, we cannot reliably determine the public_id
    if (versionIndex === -1) {
        return null;
    }

    // The public_id is all segments after the version, joined back together
    const publicIdWithExtension = parts.slice(versionIndex + 1).join("/");

    // Remove the file extension from the end
    const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
    return publicId;
};

//function for single product info
const singleProduct = async (req, res) => {
    try {
        const {id} = req.body;
        let product = await productModel.findById(id);
        if(!product){
            return res.status(404).json({succes:false,message:"product does not exist."})
        }
        return res.status(200).json({success:true,message:"product data fetched successfully.",product:product})
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export { singleProduct, addProduct, listProduct, removeProduct };