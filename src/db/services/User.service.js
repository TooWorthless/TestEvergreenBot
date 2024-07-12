import { User } from '../index.js';

class UserService {

    async getUserById(userId) {
        try {
            const userData = await User.findAll({
                where: {
                    id: userId
                }
            });

            if (!userData || userData.length <= 0) {
                throw new Error('User not found!');
            }

            return userData.dataValues;

        } catch (error) {
            console.log('error.stack :>> ', error.stack);
        }
    }


    async getUserByTelegramId(userTelegramId) {
        try {
            const userData = await User.findAll({
                where: {
                    telegramId: userTelegramId
                }
            });

            if (!userData || userData.length === 0) {
                return;
            }

            return userData[0].dataValues;

        } catch (error) {
            console.log('error.stack :>> ', error.stack);
        }
    }


    async getUserByPhone(userPhone) {
        try {
            const userData = await User.findAll({
                where: {
                    phone: userPhone
                }
            });

            if (!userData || userData.length === 0) {
                return;
            }

            return userData[0].dataValues;

        } catch (error) {
            console.log('error.stack :>> ', error.stack);
        }
    }


    async getUsers() {
        try {
            const users = await User.findAll({});

            return users.map((user) => {
                return user.dataValues;
            });

        } catch (error) {
            console.log('error.stack :>> ', error.stack);
        }
    }


    async createUser(newUserData) {
        try {
            const newUser = await User.create({
                telegramId: newUserData.telegramId,
                name: newUserData.name,
                surname: newUserData.surname,
                phone: newUserData.phone,
                place: newUserData.place,
                telegramName: newUserData.telegramName
            });

            return newUser.dataValues;

        } catch (error) {
            console.log('error.stack :>> ', error.stack);
        }
    }


    async updateUser(userId, userData) {
        try {
            const updatedUser = await User.update(
                userData,
                {
                    where: {
                        id: userId
                    },
                },
            );

            return true;

        } catch (error) {
            console.log('error.stack :>> ', error.stack);
            return false;
        }
    }

}

const userService = new UserService();

export default userService;