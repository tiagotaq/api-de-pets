const { version } = require('../../package.json');

function getStatus() {
  return {
    status: 'Operacional',
    version,
    database: {
      status: 'Operacional',
      maxConnections: 900,
    },
  };
}

module.exports = {
  getStatus,
};
