const { getDb } = require('../config/firebase');

// Student: Report an issue
exports.reportIssue = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const db = getDb();
    const ref = await db.collection('issues').add({
      title,
      description,
      category: category || 'Other',
      reportedBy: req.user._id,
      reporterName: req.user.name,
      reporterEmail: req.user.email,
      status: 'Open',
      adminResponse: '',
      createdAt: new Date().toISOString(),
    });
    res.status(201).json({ message: 'Issue reported successfully', issue: { _id: ref.id } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to report issue', error: error.message });
  }
};

// Student: Get my issues
exports.getMyIssues = async (req, res) => {
  try {
    const db = getDb();
    const snapshot = await db
      .collection('issues')
      .where('reportedBy', '==', req.user._id)
      .orderBy('createdAt', 'desc')
      .get();
    const issues = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch issues', error: error.message });
  }
};

// Admin: Get all issues
exports.getAllIssues = async (req, res) => {
  try {
    const db = getDb();
    const snapshot = await db.collection('issues').orderBy('createdAt', 'desc').get();
    const issues = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch issues', error: error.message });
  }
};

// Admin: Update issue status & response
exports.updateIssue = async (req, res) => {
  try {
    const { status, adminResponse } = req.body;
    const db = getDb();
    const docRef = db.collection('issues').doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    const update = { status, adminResponse: adminResponse || '' };
    if (status === 'Resolved') update.resolvedAt = new Date().toISOString();

    await docRef.update(update);
    const updated = await docRef.get();
    res.json({ message: 'Issue updated', issue: { _id: updated.id, ...updated.data() } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update issue', error: error.message });
  }
};
