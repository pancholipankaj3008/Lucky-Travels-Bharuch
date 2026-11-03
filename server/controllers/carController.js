const Car = require("../models/Car");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// Upload image to Cloudinary
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: "lucky-travels/cars",
      },
      (error, result) => {
        if (error) {
          console.log("Cloudinary Upload Error:", error);
          return reject(error);
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    ).end(file.buffer);
  });
};

// Add Car
const addCar = async (req, res) => {
  try {
    const { name, description, category, passengerCapacity, luggageCapacity } = req.body;

    if (!name || !description || !category || !passengerCapacity || luggageCapacity === undefined || !Number.isInteger(Number(luggageCapacity)) || Number(luggageCapacity) < 0) {
      return res.status(400).json({
        success: false,
        message: "All car details are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Car image is required",
      });
    }

    const image = await uploadToCloudinary(req.file);

    const car = await Car.create({
      name,
      description,
      category,
      passengerCapacity,
      luggageCapacity,
      image,
    });

    res.status(201).json({
      success: true,
      message: "Car added successfully",
      car,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Cars
const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      cars,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Car
const getSingleCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    res.status(200).json({
      success: true,
      car,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Car
const updateCar = async (req, res) => {
  try {
    const { name, description, category, passengerCapacity, luggageCapacity } = req.body;

    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    if (name) car.name = name;
    if (description) car.description = description;
    if (category) car.category = category;

    if (passengerCapacity) {
      car.passengerCapacity = passengerCapacity;
    }
    if (passengerCapacity !== undefined && Number(passengerCapacity) > 0) {
      car.passengerCapacity = passengerCapacity;
    }
    if (luggageCapacity !== undefined && Number.isInteger(Number(luggageCapacity)) && Number(luggageCapacity) >= 0) {
      car.luggageCapacity = luggageCapacity;
    } else if (car.luggageCapacity == null) {
      car.luggageCapacity = car.passengerCapacity;
    }

    if (req.file) {
      await cloudinary.uploader.destroy(car.image.publicId);

      car.image = await uploadToCloudinary(req.file);
    }

    await car.save();

    res.status(200).json({
      success: true,
      message: "Car updated successfully",
      car,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Delete Car
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }
    
if (car.image && car.image.publicId) {
  await cloudinary.uploader.destroy(car.image.publicId);
}

    await Car.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Car deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addCar,
  getAllCars,
  getSingleCar,
  updateCar,
  deleteCar,
};
