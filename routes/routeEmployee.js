import { Router } from "express";
import { getAllEmployee, login, register } from "../Controllers/auth.js";
import { isLogin, logout } from "../Controllers/loginHandle.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const routerEmployee = Router()
routerEmployee.post("/auth/register",verifyAdmin,register)
routerEmployee.post("/auth/login",login)
routerEmployee.post("/auth/logout",logout)
routerEmployee.post("/auth",isLogin)

routerEmployee.get("/",getAllEmployee)


export default routerEmployee