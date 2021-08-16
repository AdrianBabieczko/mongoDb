const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;
const Department = require('../models/department.model');

router.get('/departments', async (req, res) => {
  try {
    res.json(await Department.find({}));
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get('/departments/random', (req, res) => {
  req.db.collection('departments').aggregate([{ $sample: { size: 1 } }]).toArray((err, data) => {
    if (err) res.status(500).json({ message: err });
    else res.json(data[0]);
  });
});

router.get('/departments/:id', (req, res) => {
  var myId = JSON.parse(req.params.id);
  req.db.collection('departments').findOne({ _id: ObjectId(myId) }, (err, data) => {
    if (err) res.status(500).json({ message: err });
    else if (!data) res.status(404).json({ message: 'Not found' });
    else res.json(data);
  });
});

router.post('/departments', async (req, res) => {
  try {
    const { name } = req.body;
    const newDepartment = new Department({ name: name });
    await newDepartment.save();
    res.json({ message: 'OK' });
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
});

router.put('/departments/:id', (req, res) => {
  const { name } = req.body;
  var myId = JSON.parse(req.params.id);

  req.db.collection('departments').findOne({ _id: ObjectId(myId) }, (err, data) => {
    if (err) res.status(500).json({ message: err });
    else if (!data) res.status(404).json({ message: 'Not found' });
    else {
      req.db.collection('departments').updateOne({ _id: ObjectId(myId) }, { $set: { name: name } }, err => {
        if (err) res.status(500).json({ message: err });
        else res.json({ message: 'OK' });
      });
    }
  });
});

router.delete('/departments/:id', (req, res) => {
  var myId = JSON.parse(req.params.id);

  req.db.collection('departments').findOne({ _id: ObjectId(myId) }, (err, data) => {
    if (err) res.status(500).json({ message: err });
    else if (!data) res.status(404).json({ message: 'Not found' });
    else {
      req.db.collection('departments').deleteOne({ _id: ObjectId(myId) }, err => {
        if (err) res.status(500).json({ message: err });
        else res.json({ message: 'OK' });
      });
    }
  });
});

module.exports = router;
