import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET;


export const authRequired = (req,res,next) => {
  
     const {token} = req.cookies
     if(!token) 
      return res.status(401).json({message:"no token no autorizado"});

      jwt.verify(token,TOKEN_SECRET,(err,user)=>{
          if(err) return res.status(403).json({message:"token invalido"});

          req.user = user

           next();
      })

    

}



export const isAdmin = (req,res,next) => {
     const {token}  = req.cookies
     if(!token)
     return res.status(401).json({message:"No token no autorizado"});
       
     jwt.verify(token,TOKEN_SECRET,(err,decoded)=>{
          if(err) return res.status(403).json({message:"token invalido"})
     
               const {role} = decoded
               if(role !== "admin") return res.status(403).json({message:"acceso denegado solo administradores"})
         
                    next();


     })


  
}