import { Router } from "express";
import {singleProduct,addProduct,listProduct,removeProduct} from "../controllers/productController.js"
import { upload } from "../middleware/multerMiddleware.js";
import adminAuth from "../middleware/adminAuthMiddleware.js";

const productRouter = Router();


const multerMiddleware = upload.fields([{name:"image1",maxCount:1},{name:"image2",maxCount:1},{name:"image3",maxCount:1},{name:"image4",maxCount:1}])
productRouter.post("/add",adminAuth,multerMiddleware,addProduct);

productRouter.post("/remove",adminAuth,removeProduct);

productRouter.post("/single",singleProduct);

productRouter.get("/list",listProduct);

export default productRouter;




