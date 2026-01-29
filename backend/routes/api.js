const express = require('express');
const router = express.Router();

const Student = require('../models/Student');
const GradeRange = require('../models/GradeRange');
const TraitRange = require('../models/TraitRange');

router.post('/personality', async (req, res) => {
  // Use Number() to ensure we are doing math on numbers, not strings
  const name = req.body.name;
  const subject1 = Number(req.body.subject1);
  const subject2 = Number(req.body.subject2);
  const subject3 = Number(req.body.subject3);

  if (!name || isNaN(subject1) || isNaN(subject2) || isNaN(subject3)) {
    return res.status(400).json({ error: 'All fields are required and must be numbers' });
  }

  const avg = (subject1 + subject2 + subject3) / 3;

  try {
    const student = new Student({
      name,
      subject1,
      subject2,
      subject3,
      average: avg
    });
    await student.save();

    // Find grade - using $lte and $gte
    const gradeDoc = await GradeRange.findOne({
      minAvg: { $lte: avg },
      maxAvg: { $gte: avg }
    });

    if (!gradeDoc) {
      return res.status(404).json({ error: 'No matching grade range found in DB. Did you run /seed?' });
    }

    const traitDoc = await TraitRange.findOne({
      // minGrade: { $lte: gradeDoc.grade },
      // maxGrade: { $gte: gradeDoc.grade }
       grade: gradeDoc.grade
    });

    if (!traitDoc) {
      return res.status(404).json({ error: 'No matching personality trait found.' });
    }

    res.json({
      name,
      average: avg.toFixed(2),
      grade: gradeDoc.grade,
      personalityTrait: traitDoc.trait
    });
  } catch (err) {
    console.error("Route Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

