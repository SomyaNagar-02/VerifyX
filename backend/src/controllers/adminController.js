const asyncHandler = require('../utils/asyncHandler');
const { Document, AuditLog } = require('../models');

/**
 * @desc    Get dashboard statistics for the logged-in issuer
 * @route   GET /api/admin/stats
 * @access  Protected
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  // 1. Get all documents issued by this user
  const userDocs = await Document.find({ createdBy: req.user.id }).select('sealId');
  const sealIds = userDocs.map(doc => doc.sealId).filter(Boolean);

  // 2. Count documents sealed by this issuer
  const documentsSealedCount = userDocs.length;

  // 3. Count verifications run on this issuer's documents
  const verificationsCount = await AuditLog.countDocuments({
    action: 'VERIFY',
    sealId: { $in: sealIds }
  });

  // 4. Count total audit logs associated with this issuer (either by their user ID or their issued documents)
  const auditLogsCount = await AuditLog.countDocuments({
    $or: [
      { userId: req.user.id },
      { sealId: { $in: sealIds } }
    ]
  });

  res.status(200).json({
    success: true,
    data: {
      documentsSealed: documentsSealedCount,
      verificationsRun: verificationsCount,
      auditLogsCount: auditLogsCount,
      role: req.user.role
    }
  });
});

/**
 * @desc    Get system activity/audit logs for the logged-in issuer
 * @route   GET /api/admin/logs
 * @access  Protected
 */
const getSystemActivityLogs = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const page = parseInt(req.query.page, 10) || 1;
  const skip = (page - 1) * limit;

  // Find all documents issued by this user to fetch associated logs
  const userDocs = await Document.find({ createdBy: req.user.id }).select('sealId');
  const sealIds = userDocs.map(doc => doc.sealId).filter(Boolean);

  // Filter logs relevant to this issuer
  const query = {
    $or: [
      { userId: req.user.id },
      { sealId: { $in: sealIds } }
    ]
  };

  const totalLogs = await AuditLog.countDocuments(query);
  const logs = await AuditLog.find(query)
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)
    .populate('userId', 'name email role');

  res.status(200).json({
    success: true,
    data: logs,
    pagination: {
      total: totalLogs,
      page,
      limit,
      pages: Math.ceil(totalLogs / limit)
    }
  });
});

module.exports = {
  getDashboardStats,
  getSystemActivityLogs
};
