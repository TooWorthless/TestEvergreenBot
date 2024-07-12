import { Manager } from '../index.js';

class ManagerService {

    async getManagerById(managerId) {
        try {
            const managerData = await Manager.findAll({
                where: {
                    id: managerId
                }
            });

            if (!managerData || managerData.length <= 0) {
                throw new Error('Manager not found!');
            }

            return managerData.dataValues;

        } catch (error) {
            console.log('error.stack :>> ', error.stack);
        }
    }


    async getManagerByTelegramId(managerTelegramId) {
        try {
            const managerData = await Manager.findAll({
                where: {
                    telegramId: managerTelegramId
                }
            });

            if (!managerData || managerData.length === 0) {
                return;
            }

            return managerData[0].dataValues;

        } catch (error) {
            console.log('error.stack :>> ', error.stack);
        }
    }


    async getManagers() {
        try {
            const managers = await Manager.findAll({});

            return managers.map((manager) => {
                return manager.dataValues;
            });

        } catch (error) {
            console.log('error.stack :>> ', error.stack);
        }
    }

    async getFreeManagers() {
        try {
            const managers = await Manager.findAll({
                where: {
                    status: 'free'
                }
            });

            return managers.map((manager) => {
                return manager.dataValues;
            });

        } catch (error) {
            console.log('error.stack :>> ', error.stack);
        }
    }


    async createManager(newManagerData) {
        try {
            const newManager = await Manager.create({
                telegramId: newManagerData.telegramId,
                name: newManagerData.name
            });

            return newManager.dataValues;

        } catch (error) {
            console.log('error.stack :>> ', error.stack);
        }
    }


    async updateManager(managerId, managerData) {
        try {
            const updatedManager = await Manager.update(
                managerData,
                {
                    where: {
                        id: managerId
                    },
                },
            );

            return true;

        } catch (error) {
            console.log('error.stack :>> ', error.stack);
            return false;
        }
    }


    async deleteManagerById(managerId) {
        try {
            await Manager.destroy({
                where: {
                    id: managerId
                },
            });

            return true;

        } catch (error) {
            console.log('error.stack :>> ', error.stack);
            return false;
        }
    }

}

const managerService = new ManagerService();

export default managerService;