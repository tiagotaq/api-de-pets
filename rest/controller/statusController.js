const statusService = require('../../src/service/statusService');

function getStatus(req, res) {
  res.json(statusService.getStatus());
}

module.exports = {
  getStatus,
};
