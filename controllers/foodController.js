import foodModel from "../models/foodModel.js";
import fs from 'fs'

//add
const addFood = async (req, res) => {

    let image_filename = `${req.file.filename}`

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    })
    try {
        await food.save();
        res.json({ success: true, message: "Food Added" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "error" })
    }
}

//all food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// Update food
const updateFood = async (req, res) => {
    const foodId = req.params.id;

    try {
        // Prepare update data
        const updateData = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
        };

        // If a new image is uploaded, handle it
        if (req.file) {
            updateData.image = req.file.filename; // Use the new image filename
        }

        // Update the food item in the database
        const updatedFood = await foodModel.findByIdAndUpdate(foodId, updateData, {
            new: true, // Return the updated document
            runValidators: true, // Run schema validators on update
        });

        if (updatedFood) {
            res.json({ success: true, message: "Food updated", data: updatedFood });
        } else {
            res.json({ success: false, message: "Food not found" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating food item" });
    }
};

//remove food 
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`, () => { })

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Food Removed"});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

export { addFood, listFood, removeFood,updateFood }