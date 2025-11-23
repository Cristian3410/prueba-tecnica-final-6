import {Router} from "express";
import  {login,register,logout,profile,courses,getAllUsers,verifyToken,updateUserCourse,removeUserCourse} from "../controllers/auth.controllers.js"
import {authRequired,isAdmin} from "../middlewares/validateToken.js"
import {validate,userRegisterValidator} from "../schemas/userValidator.js"

const router = Router();

router.post("/register", userRegisterValidator, validate,register); 

router.post("/login", login);

router.get("/logout",logout);

router.get("/profile",authRequired,profile)

router.get("/courses",courses)

router.get("/users",authRequired,isAdmin,getAllUsers)

router.get("/verify", verifyToken);

router.put("/users/:id/course", authRequired, isAdmin, updateUserCourse);

router.delete("/users/:id/course", authRequired, isAdmin, removeUserCourse);


export default router