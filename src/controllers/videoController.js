const Video = require('../models/Video');

const uploadVideo = async (req, res) => {
  try {
    console.log('Upload Request Body:', req.body);
    console.log('Upload Request Files:', req.files);
    
    const { title, description } = req.body;
    
    if (!req.files || !req.files.video) {
      return res.status(400).json({ message: 'Please upload a video file' });
    }

    const videoFile = req.files.video[0];
    const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;

    const video = await Video.create({
      title,
      description,
      cloudinaryUrl: videoFile.path,
      cloudinaryPublicId: videoFile.filename,
      thumbnailUrl: thumbnailFile ? thumbnailFile.path : '',
      thumbnailPublicId: thumbnailFile ? thumbnailFile.filename : '',
      adminId: req.user._id,
    });

    res.status(201).json(video);
  } catch (error) {
    console.error('Video Upload Error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    console.error('Get Videos Error:', error);
    res.status(500).json({ message: error.message });
  }
};

const { cloudinary } = require('../config/cloudinary');

const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Optional: Only allow the admin who uploaded it to delete it
    // if (video.adminId.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ message: 'Not authorized to delete this video' });
    // }

    // Delete video from Cloudinary
    if (video.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(video.cloudinaryPublicId, { resource_type: 'video' });
    }

    // Delete thumbnail from Cloudinary (using 'image' resource type)
    if (video.thumbnailPublicId) {
      await cloudinary.uploader.destroy(video.thumbnailPublicId, { resource_type: 'image' });
    }

    await video.deleteOne();

    res.json({ message: 'Video removed successfully' });
  } catch (error) {
    console.error('Delete Video Error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getUploadSignature = async (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: 'company_assets',
      },
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating signature' });
  }
};

const saveVideoRecord = async (req, res) => {
  try {
    const { title, description, cloudinaryUrl, cloudinaryPublicId, thumbnailUrl, thumbnailPublicId } = req.body;
    
    const video = await Video.create({
      title,
      description,
      cloudinaryUrl,
      cloudinaryPublicId,
      thumbnailUrl,
      thumbnailPublicId,
      adminId: req.user._id,
    });

    res.status(201).json(video);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { uploadVideo, getVideos, deleteVideo, getUploadSignature, saveVideoRecord };
