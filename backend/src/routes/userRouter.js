import { Router } from 'express'
import { login, register, logout, adminLogin, verifyAdmin, logoutAdmin, verifyUser } from '../controllers/userController.js';
import adminAuth from '../middleware/adminAuthMiddleware.js';
import userAuth from '../middleware/userAuthMiddleware.js'

const userRouter = Router();

userRouter.post('/register',register);
userRouter.post('/login', login);
userRouter.get('/verifyUser',userAuth,verifyUser)
userRouter.post('/logout',userAuth,logout);


userRouter.post('/loginAdmin', adminLogin);
userRouter.get('/verifyAdmin', adminAuth, verifyAdmin);
userRouter.post('/logoutAdmin', adminAuth, logoutAdmin);

export default userRouter;