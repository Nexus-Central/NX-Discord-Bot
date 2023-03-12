// Export the below functions to be used in the index.js file
module.exports = { formatUptime, formatMemoryUsage };

const formatUptime = uptime => {
	const seconds = Math.floor(uptime % 60);
	const minutes = Math.floor((uptime / 60) % 60);
	const hours = Math.floor(uptime / 3600 % 24);
	const days = Math.floor(uptime / 86400);
	const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;
	return uptimeString;
};

const formatMemoryUsage = memUsage => {
	const memUsageMB = Math.round(memUsage / 1024 / 1024 * 100) / 100;
	const memUsageString = `${memUsageMB} MB`;
	return memUsageString;
};