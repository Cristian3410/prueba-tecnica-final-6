import Program from "../models/program.model.js"
import User from "../models/user.model.js"



export const assignUserToProgram = async (req,res)  => {

    const {programId} =req.user.id
    try{

        if (!programId){
         return res.status(400).json({message:"el programId es requerido"})
        }
        
        const user = await User.findById(UserId)
        if(!user){
         return res.status(404).json({message:"usuario no encontrado"})   
        }

        const program = await Program.findById(programId)
        if(!program){
           return res.status(404).json({message:"Curso no encontrado"})
        }

        user.programId = programId
        await user.save()

        res.json({message:"curso asignado al usuario con exito"})

    }catch(error){
       console.log(error)
       res.status(500).json({message:"Error al asignar el curso al usuario"})
    }
   

};

