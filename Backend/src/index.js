import app from "../src/app.js";
import { connectDB } from "./db.js";


connectDB();
app.listen(4000);
console.log("server on port",4000);