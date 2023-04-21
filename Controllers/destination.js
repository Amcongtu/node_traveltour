import cloudinary from "cloudinary";
import Destination from "../models/Destination.js";
import Tour from "../models/Tour.js";
function connectCloud() {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
}

export const createDestination = async (req, res, next) => {
  connectCloud();
  const { ...destination } = req.body;
  var saveDestination = {};
  try {
    const newdDestination = new Destination({
      ...destination,
    });
    saveDestination = await newdDestination.save();
    return res.status(200).json(saveDestination);
  } catch (err) {
    if (req.body?.public_key_image) {
      await cloudinary.uploader.destroy(req.body.public_key_image, {
        invalidate: true,
      });
    }

    next(err);
  }
};

export const updateDestination = async (req, res, next) => {
  connectCloud();
  const { image, ...destination } = req.body;
  const avt = req.body.image;
  let result = {};
  var updatedDestination = {};
  try {
    const destinationId = req.params.id;
    const existingDestination = await Destination.findById(destinationId);
    if (!existingDestination) {
      return res.status(404).json({ message: "Destination not found" });
    }
    const pathClodudinary = `destinations/${req.body.name}`;
    if (avt) {
      result = await cloudinary.uploader.upload(
        avt,
        function (res) {
          return;
        },
        {
          folder: pathClodudinary,
          use_filename: true,
        }
      );
      if (existingDestination.public_key_image) {
        await cloudinary.uploader.destroy(
          existingDestination.public_key_image,
          { invalidate: true }
        );
      }
      existingDestination.image = result.secure_url;
      existingDestination.public_key_image = result.public_id;
    }

    existingDestination.name = destination.name;
    existingDestination.description = destination.description;
    existingDestination.status = destination.status;

    updatedDestination = await existingDestination.save();
    return res.status(200).json(updatedDestination);
  } catch (err) {
    if (result && result?.public_id) {
      await cloudinary.uploader.destroy(result.public_id, { invalidate: true });
    }
    next(err);
  }
};

export const deleteDestination = async (req, res, next) => {
  try {
    const destinationId = req.params.id;
    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }
    for (let i = 0; i < destination.tours.length; i++) {
      const tourId = destination.tours[i]._id;

      await deleteTourById(tourId);
    }

    try {
      if (destination.public_key_image) {
        await cloudinary.uploader.destroy(destination.public_key_image, {
          invalidate: true,
        });
      }
    } catch (error) {
      return res.status(500).json({ message: "Delete image failed." });
    }


    await Destination.findByIdAndRemove(destinationId);

    return res
      .status(200)
      .json({ message: "Destination deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export const getAllToursOfDestination = async (req, res, next) => {
  try {
    const destinationId = req.params.id;
    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    const tours = await Tour.find({ _id: { $in: destination.tours } });

    return res.status(200).json(tours);
  } catch (err) {
    next(err);
  }
};

export const getDestinationById = async (req, res, next) => {
  try {
    const destinationId = req.params.id;
    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    // const tours = await Tour.find({ _id: { $in: destination.tours }, status: 'published' });

    return res.status(200).json(destination);
  } catch (err) {
    next(err);
  }
};

export const getToursOfDestination = async (req, res, next) => {
  try {
    const destinationId = req.params.id;
    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    const tours = await Tour.find({ _id: { $in: destination.tours } });

    return res.status(200).json(tours);
  } catch (err) {
    next(err);
  }
};
export const getDestinations = async (req, res, next) => {
  try {
    const page = parseInt(req.params.page) || 1; // số trang hiện tại, mặc định là trang 1 nếu không được cung cấp
    const limit = parseInt(req.query.limit) || 10; // số lượng bản ghi trên mỗi trang, mặc định là 10 nếu không được cung cấp

    // Tính toán số lượng bản ghi và số lượng trang
    const count = await Destination.countDocuments({ status: "published" });
    const totalPages = Math.ceil(count / limit);

    // Tìm danh sách các bản ghi
    const skip = (page - 1) * limit;
    const destinations = await Destination.find({ status: "published" })
      .select("_id name")
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      destinations,
      totalPages,
      currentPage: page,
      totalItems: count,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllDestinations = async (req, res, next) => {
  try {
    // Tính toán số lượng bản ghi và số lượng trang

    // Tìm danh sách các bản ghi

    const destinations = await Destination.find().sort({ createdAt: "desc" });

    return res.status(200).json(destinations);
  } catch (err) {
    next(err);
  }
};

async function deleteTourById(tourId) {
  connectCloud()
  const tourid = String(tourId);

  const tour = await Tour.findOne({ _id: tourid });

  if (!tour) {
    return;
  }

  try {
    // Xóa ảnh đại diện tour trên Cloudinary nếu có
    if (tour.image_public_id) {

      await cloudinary.uploader.destroy(tour.image_public_id, {
        invalidate: true,
      });
    }
  } catch (error) {
    // Bỏ qua lỗi nếu không thể xóa ảnh đại diện
  }

  try {
    // Xóa các ảnh trong nội dung tour trên Cloudinary nếu có
    if (tour.public_id && tour.public_id.length > 0) {

      for (let i = 0; i < tour.public_id.length; i++) {
        await cloudinary.uploader.destroy(tour.public_id[i], {
          invalidate: true,
        });

      }
    }
  } catch (error) {
        // Bỏ qua lỗi nếu không thể xóa các ảnh trong nội dung tour
  }

  // Xóa tour
  await Tour.findByIdAndRemove(tourId);
}
