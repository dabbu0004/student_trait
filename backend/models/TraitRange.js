// const mongoose = require('mongoose');

// const traitRangeSchema = new mongoose.Schema({
//   minGrade: Number,
//   maxGrade: Number,
//   trait: String
// });

// const TraitRange = mongoose.model('TraitRange', traitRangeSchema);


// module.exports = TraitRange;


const mongoose = require('mongoose');

const traitRangeSchema = new mongoose.Schema({
  grade: {
    type: String,
    required: true
  },
  trait: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('TraitRange', traitRangeSchema);
