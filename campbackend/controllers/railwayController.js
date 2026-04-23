const { getDb } = require('../config/firebase');

// Apply for railway concession
exports.applyForConcession = async (req, res) => {
  try {
    const { studentName, email, rollNumber, yearOfStudy, fromStation, toStation, trainClass, concessionType, purpose } = req.body;
    const db = getDb();

    // Check if user already has a pending application
    const existing = await db
      .collection('railway')
      .where('user', '==', req.user._id)
      .where('status', '==', 'Pending')
      .get();

    if (!existing.empty) {
      return res.status(400).json({ message: 'You already have a pending application. Please wait for it to be processed.' });
    }

    const ref = await db.collection('railway').add({
      user: req.user._id,
      studentName,
      email,
      rollNumber,
      yearOfStudy,
      fromStation,
      toStation,
      trainClass,
      concessionType,
      purpose,
      status: 'Pending',
      remarks: '',
      appliedAt: new Date().toISOString(),
    });

    res.status(201).json({ message: 'Railway concession application submitted successfully!', application: { _id: ref.id } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit application', error: error.message });
  }
};

// Get logged-in user's application(s)
exports.getMyApplications = async (req, res) => {
  try {
    const db = getDb();
    const snapshot = await db
      .collection('railway')
      .where('user', '==', req.user._id)
      .orderBy('appliedAt', 'desc')
      .get();
    const applications = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
  }
};

// Cancel a pending application
exports.cancelApplication = async (req, res) => {
  try {
    const db = getDb();
    const docRef = db.collection('railway').doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists || doc.data().user !== req.user._id) {
      return res.status(404).json({ message: 'Application not found' });
    }
    if (doc.data().status !== 'Pending') {
      return res.status(400).json({ message: 'Only pending applications can be cancelled' });
    }

    await docRef.delete();
    res.json({ message: 'Application cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel application', error: error.message });
  }
};

// Admin: Get all applications
exports.getAllApplications = async (req, res) => {
  try {
    const db = getDb();
    const snapshot = await db.collection('railway').orderBy('appliedAt', 'desc').get();
    const applications = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();
      // Fetch user info
      let userName = data.studentName;
      let userEmail = data.email;
      if (data.user) {
        const userDoc = await db.collection('users').doc(data.user).get();
        if (userDoc.exists) {
          userName = userDoc.data().name;
          userEmail = userDoc.data().email;
        }
      }
      applications.push({
        _id: doc.id,
        ...data,
        user: data.user ? { _id: data.user, name: userName, email: userEmail } : null,
      });
    }

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
  }
};

// Admin: Update application status
exports.updateStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const db = getDb();
    const docRef = db.collection('railway').doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Application not found' });
    }

    await docRef.update({ status, remarks: remarks || '' });
    const updated = await docRef.get();
    res.json({ message: `Application ${status}`, application: { _id: updated.id, ...updated.data() } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
};
