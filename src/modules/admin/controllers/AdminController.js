const AdminRepository = require('../repositories/AdminRepository');
const DropTableInfoService = require('../services/DropTableInfoService');

const adminRepository = new AdminRepository();

class AdminController {
  async dropAllInfo(req, res) {
    const dropTableInfoService = new DropTableInfoService(adminRepository);
    const infoDeleted = await dropTableInfoService.execute();

    return res.json({
      success: true,
      message: 'Informações deletadas',
      response: infoDeleted
    });
  }
}

module.exports = AdminController;
