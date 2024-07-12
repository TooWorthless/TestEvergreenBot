// import { adminBot } from '../../admin_bot/index.js';
// import paymentProcessHelper from '../../db/helpers/payment.process.helper.js';
// import paymentService from '../../db/services/Payment.service.js';
// import config from '../../config/config.js';
// import screener from '../../screener/index.js';
// import userService from '../../db/services/User.service.js';

import managerService from '../../db/services/Manager.service.js';
import orderService from '../../db/services/Order.service.js';

class CallbackController {
    async resetMenu(msg, bot) {
        try {
            const chatId = msg.chat.id;
            const messageId = msg.message_id;

            await bot.editMessageText(
                `*Головне меню*`,
                {
                    chat_id: chatId,
                    message_id: messageId,
                    parse_mode: 'Markdown',
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [{ text: 'З\'єднати з менеджером', callback_data: `connectManager` }],
                            [{ text: 'Усі замовлення', callback_data: `orders|0` }],
                            [{ text: 'Останні замовлення', callback_data: `lastOrders` }],
                            [{ text: 'Про компанію', callback_data: `about` }],
                            [{ text: 'Профіль', callback_data: `profile` }]
                        ]
                    })
                }
            );
        } catch (error) {
            console.log(error.stack);
        }
    }


    async about(msg, bot) {
        try {
            const chatId = msg.chat.id;
            const messageId = msg.message_id;

            await bot.editMessageText(
                `*Evergreen*\n\n` +
                `\`Evergreen\` — продуктово-сервісна компанія, що спеціалізується на розробці IT проектів і продуктів «з нуля», запуску цих проектів у бізнес замовника та подальшому розвитку.`,
                {
                    chat_id: chatId,
                    message_id: messageId,
                    parse_mode: 'Markdown',
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [{ text: '❌ В головне меню', callback_data: `menu` }]
                        ]
                    })
                }
            );
        } catch (error) {
            console.log(error.stack);
        }
    }


    async profile(msg, bot, userData) {
        try {
            const chatId = msg.chat.id;
            const messageId = msg.message_id;



            await bot.editMessageText(
                `*Ваш профіль*\n\n` +
                `🧑‍💻 ${userData.name}, ${userData.surname}\n\n` +
                `📞 ${userData.phone}\n\n` +
                `🏙 ${userData.place}`,
                {
                    chat_id: chatId,
                    message_id: messageId,
                    parse_mode: 'Markdown',
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [{ text: '❌ В головне меню', callback_data: `menu` }]
                        ]
                    })
                }
            );
        } catch (error) {
            console.log(error.stack);
        }
    }


    async ordersMenu(msg, bot, actionData) {
        try {
            const chatId = msg.chat.id;
            const messageId = msg.message_id;
            const page = +actionData[0];

            const chunkOrders = (orders, chunkLength) => {
                const result = [];

                for (let orderIndex = 0; orderIndex < orders.length; orderIndex += chunkLength) {
                    const chunk = orders.slice(orderIndex, orderIndex + chunkLength);
                    result.push(chunk);
                }

                return result;
            }

            const ordersList = await orderService.getOrdersByUserId(chatId);
            if(!ordersList || ordersList.length === 0) {
                await bot.editMessageText(
                    `*У вас не знайдено замовлень*`,
                    {
                        chat_id: chatId,
                        message_id: messageId,
                        parse_mode: 'Markdown',
                        reply_markup: JSON.stringify({
                            inline_keyboard: [
                                [{ text: '❌ В головне меню', callback_data: `menu` }]
                            ]
                        })
                    }
                );
                return;
            }
            // console.log('ordersList :>> ', ordersList);

            const chunkOrdersList = chunkOrders(ordersList, 2);

            const orders = chunkOrdersList[page];
            // console.log('chunkOrdersList :>> ', chunkOrdersList);

            if (!orders) return;

            await bot.editMessageText(
                `*Замовлення*\n` +
                `Сторінка ${page + 1}\n\n` +
                (() => {
                    return orders.map((order) => {
                        return `*Замовлення* \`${order.id}\`\n` +
                            `Сума: \`${order.sum}\` грн\n\n`
                    }).join('\n')
                })(),
                {
                    chat_id: chatId,
                    message_id: messageId,
                    parse_mode: 'Markdown',
                    reply_markup: JSON.stringify({
                        inline_keyboard: (
                            () => {
                                const ikeyboard = [];
                                const nav = [];
                                if (page > 0) {
                                    nav.push({ text: '<', callback_data: `orders|${page - 1}` })
                                }

                                nav.push({ text: '-', callback_data: `-` });

                                if (page < chunkOrdersList.length - 1) {
                                    nav.push({ text: '>', callback_data: `orders|${page + 1}` })
                                }

                                ikeyboard.push(nav);


                                ikeyboard.push([{ text: '❌ В головне меню', callback_data: `menu` }]);

                                return ikeyboard;
                            }
                        )()

                    })
                }
            );

        } catch (error) {
            console.log(error.stack);
        }
    }


    async lastOrders(msg, bot) {
        try {
            const chatId = msg.chat.id;
            const messageId = msg.message_id;

            let ordersList = await orderService.getOrdersByUserId(chatId);
            if(!ordersList || ordersList.length === 0) {
                await bot.editMessageText(
                    `*У вас не знайдено замовлень*`,
                    {
                        chat_id: chatId,
                        message_id: messageId,
                        parse_mode: 'Markdown',
                        reply_markup: JSON.stringify({
                            inline_keyboard: [
                                [{ text: '❌ В головне меню', callback_data: `menu` }]
                            ]
                        })
                    }
                );
                return;
            }
            console.log('ordersList :>> ', ordersList);
            if(ordersList.length > 5) {
                ordersList = ordersList.splice(ordersList.length-5, 5);
            }


            await bot.editMessageText(
                `*Останні замовлення*\n\n` +
                (() => {
                    return ordersList.map((order) => {
                        return `*Замовлення* \`${order.id}\`\n` +
                            `Сума: \`${order.sum}\` грн\n\n`
                    }).join('\n')
                })(),
                {
                    chat_id: chatId,
                    message_id: messageId,
                    parse_mode: 'Markdown',
                    reply_markup: JSON.stringify({
                        inline_keyboard: (
                            () => {
                                const ikeyboard = [];
                                
                                ikeyboard.push([{ text: '❌ В головне меню', callback_data: `menu` }]);

                                return ikeyboard;
                            }
                        )()

                    })
                }
            );

        } catch (error) {
            console.log(error.stack);
        }
    }


    async connectManager(msg, bot, userData) {
        try {
            const chatId = msg.chat.id;
            const messageId = msg.message_id;


            const managers = await managerService.getFreeManagers();

            if(!managers || managers.length === 0) {
                await bot.editMessageText(
                    `*Поки що вільних операторів немає, зверніться пізніше*\n\n`,
                    {
                        chat_id: chatId,
                        message_id: messageId,
                        parse_mode: 'Markdown',
                        reply_markup: JSON.stringify({
                            inline_keyboard: [
                                [{ text: '❌ В головне меню', callback_data: `menu` }]
                            ]
                        })
                    }
                );
            }

            const manager = managers[0];
            await managerService.updateManager(manager.id, {
                user_chat_id: chatId,
                status: 'busy'
            });


            await bot.sendMessage(
                manager.telegramId,
                '*Запит від користувача на консультацію:*\n' +
                `🧑‍💻 ${userData.name}, ${userData.surname}\n\n` +
                `📞 ${userData.phone}\n\n` +
                `🏙 ${userData.place}`,
                {
                    parse_mode: 'Markdown',
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [{ text: '❌ Закінчити з\'єднання', callback_data: `cancel|connection` }]
                        ]
                    })
                }
            );


            await bot.editMessageText(
                `*Оператора знайдено, найближчим часом він зв'яжеться з вами*\n\n`,
                {
                    chat_id: chatId,
                    message_id: messageId,
                    parse_mode: 'Markdown',
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [{ text: '❌ В головне меню', callback_data: `menu` }]
                        ]
                    })
                }
            );
        } catch (error) {
            console.log(error.stack);
        }
    }

    async cancel(msg, bot, actionData) {
        try {
            const chatId = msg.chat.id;
            const messageId = msg.message_id;
            const cancelAction = actionData[0];

            if (cancelAction === 'connection') {
                const manager = await managerService.getManagerByTelegramId(chatId);
                if(manager) {
                    managerService.updateManager(manager.id, {
                        user_chat_id: null,
                        status: 'free'
                    });
                }

                await bot.editMessageText(
                    msg.text +
                    `\n\n*З'єднання закінчене!*`,
                    {
                        chat_id: chatId,
                        message_id: messageId,
                        parse_mode: 'Markdown',
                        reply_markup: JSON.stringify({
                            inline_keyboard: [
                            ]
                        })
                    }
                );
            }

        } catch (error) {
            console.log(error.stack);
        }
    }

}

const callbackController = new CallbackController();


export default callbackController;