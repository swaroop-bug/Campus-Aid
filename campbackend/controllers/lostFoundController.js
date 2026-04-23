const { getDb } = require('../config/firebase');

// Get all lost & found posts (with optional filters)
exports.getPosts = async (req, res) => {
  try {
    const { type, search } = req.query;
    const db = getDb();
    let query = db.collection('lostfound').orderBy('createdAt', 'desc');

    const snapshot = await query.get();
    let posts = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));

    // Filter by type if provided
    if (type) {
      posts = posts.filter(p => p.type === type);
    }

    // Filter by search term if provided
    if (search) {
      const searchLower = search.toLowerCase();
      posts = posts.filter(p =>
        (p.title && p.title.toLowerCase().includes(searchLower)) ||
        (p.description && p.description.toLowerCase().includes(searchLower)) ||
        (p.category && p.category.toLowerCase().includes(searchLower)) ||
        (p.location && p.location.toLowerCase().includes(searchLower))
      );
    }

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
  }
};

// Create a lost/found post
exports.createPost = async (req, res) => {
  try {
    const { title, description, type, category, location, contactEmail, contactPhone } = req.body;
    const db = getDb();

    const postData = {
      title,
      description,
      type,
      category: category || '',
      location: location || '',
      contactEmail: contactEmail || '',
      contactPhone: contactPhone || '',
      image: req.file ? `/uploads/${req.file.filename}` : null,
      status: 'active',
      postedBy: req.user._id,
      postedByName: req.user.name,
      postedByEmail: req.user.email,
      createdAt: new Date().toISOString(),
    };

    const ref = await db.collection('lostfound').add(postData);
    res.status(201).json({ message: 'Post created successfully', post: { _id: ref.id, ...postData } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
};

// Delete a post (own post or admin)
exports.deletePost = async (req, res) => {
  try {
    const db = getDb();
    const docRef = db.collection('lostfound').doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const postData = doc.data();
    const isOwner = postData.postedBy === req.user._id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await docRef.delete();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete post', error: error.message });
  }
};

// Mark post as forgotten
exports.forgetPost = async (req, res) => {
  try {
    const db = getDb();
    const docRef = db.collection('lostfound').doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await docRef.update({ status: 'forgotten' });
    res.json({ message: 'Post marked as forgotten' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update post', error: error.message });
  }
};