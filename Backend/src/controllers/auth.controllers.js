import User from "../models/user.model.js"
import Program from "../models/program.model.js"
import bcrypt from "bcryptjs"
import {createAccessToken} from "../libs/jwt.js"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET



export const updateUserCourse = async (req, res) => {
  try {
    const { id } = req.params; 
    const { programId } = req.body; 
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    user.programId = programId;
    await user.save();

    res.json({ message: "Curso actualizado", user });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el curso" });
  }
};


export const removeUserCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    user.programId = null; 
    await user.save();

    res.json({ message: "Curso eliminado", user });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el curso" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("programId"); 
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Error al obtener los usuarios"});
  }
};



export const courses = async (req,res) => {

  try{
    const programs = await Program.find();
    res.json(programs);
  }catch(error){
    console.log(error)
    res.status(500).json({message:"error al obtener los cursos"})
  }

}


export const register = async (req,res) => {

    const {fullName,email,password,role,programId} = req.body;

    
     try{

      const emailExist = await User.findOne({email});
      if(emailExist){
        return res.status(400).json({message:"el email ya se encuentra registrado"});
      }

      const fullNameExist = await User.findOne({fullName});
      if(fullNameExist){
        return res.status(400).json({message:"el nombre de usuario ya esta registrado"});
      }

    
      let  selectedProgramId = programId
      if(role === "admin"){
        const defaulProgram = await Program.findOne({name:"Curso Preterminado Admin"})
        if(!defaulProgram){
          const newProgram = new Program({
            name:"Curso Preterminado Admin",
            description:"Curso asignado por defecto a los administradores",
            startDate: new Date(),
            status:"active",
          })

          const saveProgram = await newProgram.save()
           selectedProgramId = saveProgram._id

        }else{

          selectedProgramId = defaulProgram._id

        }

        
      }

      const program = await Program.findById(selectedProgramId)
      if(!program){
        return res.status(400).json({message: "El curso selecionado no existe"})
      }
       
       const passwordHash = await bcrypt.hash(password,10)


         const newUser =  new User({
         fullName,
         email,
         password: passwordHash,
         role:role || "user",
         programId:selectedProgramId
       });

       const userSaved =  await newUser.save();

       const token = await createAccessToken({id:userSaved._id,role:userSaved.role,programId:userSaved.programId});
      

      res.cookie("token", token, {
  httpOnly: true,
  secure: false,     
  sameSite: "lax"
});
      res.json({
       id:userSaved._id,
        fullName:userSaved.fullName,
        email:userSaved.email,
        role:userSaved.role,
        programId:userSaved.programId
        });
    
     }catch(error){
      
        console.log(error);
        res.status(500).json({message:"Error al registrar el usuario"})

     }
   
    

   

}



export const login = async (req,res) => {
    
  const {email,password} = req.body;  

  try{

   const userFound =  await User.findOne({email})

   if(!userFound) return res.status(400).json({message:"no autorizado,valide las credenciales ingresadas"});

   const isMatch =  await bcrypt.compare(password,userFound.password)

   if(!isMatch) return  res.status(400).json({message:"no autorizado,valide las credenciales ingresadas"})

    const token = await createAccessToken({id:userFound._id,role:userFound.role})
    res.cookie("token", token, {
  httpOnly: true,
  secure: true,     
  sameSite: "lax"
});
    res.json({
    id:userFound._id,
    fullName:userFound.fullName,
    email:userFound.email,
    role:userFound.role,
    programId:userFound.programId
    })

  }catch(error){

    console.log(error)
     res.status(500).json({message:"Error al registrar el usuario"})
  }
 

}


export const logout = (req,res) => {

    res.cookie("token","",{
      expires:new Date(0),  
    })
   return res.sendStatus(200)
}

export const profile = async (req,res) => {
   const userFound = await User.findById(req.user.id)
  
   if(!userFound) return res.status(400).json({message:"usuario no encontrado"});

    return res.json({
      id:userFound._id,
      fullName:userFound.fullName,
      email:userFound.email,
    });
}





export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: "no autorizado" });

  try {
    const userDecoded = jwt.verify(token, process.env.TOKEN_SECRET); // esto lanza error si es inválido
    const userFound = await User.findById(userDecoded.id); // tu token lleva el id en el payload, usa .id

    if (!userFound) return res.status(401).json({ message: "no autorizado" });

    return res.json({
      id: userFound._id,
      fullName: userFound.fullName,
      email: userFound.email,
      role: userFound.role,
      programId: userFound.programId
    });
  } catch (err) {
    return res.status(401).json({ message: "no autorizado" });
  }
};