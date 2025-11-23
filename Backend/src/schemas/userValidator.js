import { body, validationResult } from "express-validator";


export const userRegisterValidator = [
  body("fullName")
    .notEmpty().withMessage("El nombre es obligatorio")
    .isLength({ min: 3 }).withMessage("El nombre debe tener mínimo 3 caracteres"),
  body("email")
    .notEmpty().withMessage("El email es obligatorio")
    .isEmail().withMessage("Email no válido"),
  body("password")
    .notEmpty().withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 }).withMessage("La contraseña debe tener mínimo 6 caracteres"),
  body("role")
    .notEmpty().withMessage("El rol es obligatorio")
    .isIn(["user", "admin"]).withMessage("Valor de rol no válido"),
  body("programId")
    .optional()
    .isMongoId().withMessage("El ID del curso no es válido")
];


export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};