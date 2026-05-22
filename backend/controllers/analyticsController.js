import Analytics from '../models/Analytics.js';
import useragent from 'useragent';

/**
 * Tracks a page visit from the client.
 */
export const trackPageview = async (req, res) => {
  const { path, referrer } = req.body;
  const rawUA = req.headers['user-agent'] || '';
  const agent = useragent.parse(rawUA);

  let device = 'Desktop';
  if (/mobile/i.test(rawUA)) {
    device = 'Mobile';
  } else if (/tablet|ipad/i.test(rawUA)) {
    device = 'Tablet';
  }

  try {
    const log = new Analytics({
      path: path || '/',
      userAgent: rawUA,
      browser: agent.family || 'Unknown',
      os: agent.os.family || 'Unknown',
      device,
      referrer: referrer || 'Direct',
      ip: req.ip || 'anonymous',
    });

    await log.save();
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Compiles aggregated statistics for the Admin Panel.
 */
export const getAnalyticsOverview = async (req, res) => {
  try {
    const totalVisitors = await Analytics.countDocuments({});

    // Daily Traffic (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyTraffic = await Analytics.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          visits: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Device breakdown
    const deviceBreakdown = await Analytics.aggregate([
      { $group: { _id: '$device', count: { $sum: 1 } } },
    ]);

    // Browser breakdown
    const browserBreakdown = await Analytics.aggregate([
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Top Pages
    const topPages = await Analytics.aggregate([
      { $group: { _id: '$path', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Traffic Sources
    const trafficSources = await Analytics.aggregate([
      { $group: { _id: '$referrer', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      totalVisitors,
      dailyTraffic,
      deviceBreakdown,
      browserBreakdown,
      topPages,
      trafficSources,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
