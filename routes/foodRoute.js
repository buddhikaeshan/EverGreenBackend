import express from "express"
import { addFood,listFood,removeFood,updateFood } from "../controllers/foodController.js"

import multer from "multer"

const foodRouter = express.Router();

//image storage
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})

const uplode = multer({ storage: storage })

foodRouter.post("/add", uplode.single("image"), addFood);
foodRouter.get("/list",listFood);
foodRouter.post("/remove",removeFood);
foodRouter.put("/update/:id", uplode.single("image"), updateFood);

export default foodRouter;
