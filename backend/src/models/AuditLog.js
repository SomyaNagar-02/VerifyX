const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ["ISSUE", "VERIFY", "SEARCH"],
    required: true
  },
  sealId: { 
    type: String 
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  result: {
    type: String,
    enum: [
      "GREEN",
      "YELLOW",
      "RED",
      "SUCCESS",
      "FAILED"
    ],
    required: true
  },
  ipAddress: { 
    type: String 
  },
  userAgent: { 
    type: String 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
