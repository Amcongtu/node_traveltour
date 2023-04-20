import { Router } from "express";
import { getAllEmployee, login, register } from "../Controllers/auth.js";
import { isLogin } from "../Controllers/loginHandle.js";

const routerEmployee = Router()
routerEmployee.post("/auth/register",register)
routerEmployee.post("/auth/login",login)
routerEmployee.post("/auth",isLogin)

// routerEmployee.get("/",getAllEmployee)


export default routerEmployee