// const LostFound = require('../models/LostFound');

// exports.createPost = async (req, res) => {
//   try {
//     const { title, description, type, category, location, contactEmail, contactPhone } = req.body;

//     const post = new LostFound({
//       title,
//       description,
//       type,
//       category,
//       location,
//       contactEmail,
//       contactPhone,
//       image: req.file ? `/uploads/${req.file.filename}` : null,
//       postedBy: req.userId
//     });

//     await post.save();
//     res.status(201).json({ message: 'Post created successfully', post });
//   } catch (error) {
//     res.status(500).json({ message: 'Post creation failed', error: error.message });
//   }
// };

// exports.getPosts = async (req, res) => {
//   try {
//     const { type, search } = req.query;
//     let query = {};

//     if (type) query.type = type;
//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: 'i' } },
//         { description: { $regex: search, $options: 'i' } },
//         { category: { $regex: search, $options: 'i' } }
//       ];
//     }

//     const posts = await LostFound.find(query).populate('postedBy', 'name email contactPhone').sort({ createdAt: -1 });
//     res.json(posts);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
//   }
// };

// exports.deletePost = async (req, res) => {
//   try {
//     const post = await LostFound.findById(req.params.id);

//     if (post.postedBy.toString() !== req.userId) {
//       return res.status(403).json({ message: 'Unauthorized' });
//     }

//     await LostFound.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Post deleted' });
//   } catch (error) {
//     res.status(500).json({ message: 'Delete failed', error: error.message });
//   }
// };


const LostFound = require('../models/LostFound');

exports.createPost = async (req, res) => {
  try {
    const { title, description, type, category, location, contactEmail, contactPhone } = req.body;

    const post = new LostFound({
      title,
      description,
      type,
      category,
      location,
      contactEmail,
      contactPhone,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      postedBy: req.userId
    });

    await post.save();
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    res.status(500).json({ message: 'Post creation failed', error: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const { type, search } = req.query;
    let query = { status: { $ne: 'forgotten' } };

    if (type) query.type = type;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await LostFound.find(query)
      .populate('postedBy', '_id name email')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await LostFound.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.postedBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await LostFound.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
};

exports.forgetPost = async (req, res) => {
  try {
    const post = await LostFound.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.postedBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    post.status = 'forgotten';
    await post.save();
    res.json({ message: 'Post marked as forgotten', post });
  } catch (error) {
    res.status(500).json({ message: 'Forget failed', error: error.message });
  }
};