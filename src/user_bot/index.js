import TelegramBot from 'node-telegram-bot-api';
import userService from '../db/services/User.service.js';
import messagesController from './controllers/Messages.controller.js';
import commandsController from './controllers/Commands.controller.js';
import callbackController from './controllers/Callback.controller.js';
import actionsHelper from '../db/helpers/actions.helper.js';


class UserBot {
    bot;

    constructor() {
        this.bot = new TelegramBot(
            '7440013438:AAGryTGYey7WzhfMcPeSLlZQsMxGSdPQ7zg',
            { polling: true }
        );
    }


    async messageHandler(msg, bot) {

        try {
            if (msg.chat.type !== 'private') return;

            const chatId = msg.chat.id;
            const messageId = msg.message_id;
            let query = msg.text || ' ';

            const user = await userService.getUserByTelegramId(chatId);

            if (user) {

                if (user.status === 'ban') return;

                if (query[0] === '/') {
                    switch (query) {
                        case '/start':
                            commandsController.start(msg, bot, {name: user.name});
                            return;
                            break;

                        default:
                            break;
                    }
                }
                else {
                    switch (query) {
                        case '⚙️Меню':
                            messagesController.menu(msg, bot);
                            break;

                        default:
                            break;
                    }
                }
            }
            else if (msg.contact) {
                const userAction = actionsHelper.getAction(chatId);

                if (userAction) {
                    actionsHelper.setActionStage(chatId, 'nameInput');
                    actionsHelper.setParams(chatId, {
                        phone: msg.contact.phone_number
                    });
                    const nameMessage = await bot.sendMessage(
                        chatId,
                        `*Введіть ваше ім'я:*`,
                        {
                            parse_mode: 'Markdown',
                            reply_markup: JSON.stringify({
                                inline_keyboard: [
                                ]
                            })
                        }
                    );
                    actionsHelper.setMessage(chatId, nameMessage);
                }

            }
            else {
                const userAction = actionsHelper.getAction(chatId);
                
                if (userAction) {
                    switch (userAction.stage) {
                        case 'nameInput':
                            const name = query;
                            console.log('name :>> ', name);
                            actionsHelper.setActionStage(chatId, 'surnameInput');
                            actionsHelper.setParams(chatId, {
                                phone: userAction.params.phone,
                                name: name
                            });
                            await bot.editMessageText(
                                `*Введіть вашу фамілію:*`,
                                {
                                    chat_id: chatId,
                                    message_id: userAction.message.message_id,
                                    parse_mode: 'Markdown',
                                    reply_markup: JSON.stringify({
                                        inline_keyboard: [
                                        ]
                                    })
                                }
                            );
                            break;

                        case 'surnameInput':
                            const surname = query;
                            console.log('surname :>> ', surname);
                            actionsHelper.setActionStage(chatId, 'cityInput');
                            actionsHelper.setParams(chatId, {
                                phone: userAction.params.phone,
                                name: userAction.params.name,
                                surname: surname
                            });
                            await bot.editMessageText(
                                `*Введіть ваше місце проживання:*`,
                                {
                                    chat_id: chatId,
                                    message_id: userAction.message.message_id,
                                    parse_mode: 'Markdown',
                                    reply_markup: JSON.stringify({
                                        inline_keyboard: [
                                        ]
                                    })
                                }
                            );
                            break;

                        case 'cityInput':
                            const city = query;
                            console.log('city :>> ', city);

                            const newUser = await userService.createUser({
                                telegramId: chatId,
                                name: userAction.params.name,
                                surname: userAction.params.surname,
                                phone: userAction.params.phone,
                                place: city,
                                telegramName: (msg.from.username || '_')
                            });

                            console.log('newUser :>> ', newUser);

                            commandsController.start(msg, bot, { name: newUser.name });
                            await bot.deleteMessage(chatId, userAction.message.message_id);
                            actionsHelper.deleteAction(chatId);
                            break;

                        default:
                            actionsHelper.deleteAction(chatId);
                            await bot.sendMessage(chatId, 'Введіть /start ще раз');
                            break;
                    }
                }
                else {
                    const userAction = actionsHelper.getAction(chatId);
                    if (!userAction) {
                        messagesController.about(msg, bot);
                        const message = await bot.sendMessage(
                            chatId,
                            `Для продовження використання бота надішліть свій номер телефону`,
                            {
                                parse_mode: 'Markdown',
                                reply_markup: JSON.stringify({
                                    keyboard: [
                                        [{ text: 'Відправити номер', request_contact: true }]
                                    ],
                                    one_time_keyboard: true
                                })
                            }
                        );
                        const newUserAction = actionsHelper.initAction(message, chatId);
                        if (newUserAction) {
                            actionsHelper.setActionStage(chatId, 'phoneInput');
                        }
                    }
                }
            }

            await bot.deleteMessage(chatId, messageId);
        }
        catch (error) {
            console.log(error.stack);
        }
    }


    async callbackHandler(callbackQuery, bot) {
        let action = callbackQuery.data;
        const msg = callbackQuery.message;

        const chatId = msg.chat.id;

        try {
            const user = await userService.getUserByTelegramId(chatId);

            if (user) {
                if (user.status === 'ban') return;


                switch (action) {

                    case 'about':
                        callbackController.about(msg, bot);
                        break;

                    case 'connectManager':
                        callbackController.connectManager(msg, bot, user);
                        break;

                    case 'profile':
                        callbackController.profile(msg, bot, user);
                        break;

                    case 'lastOrders':
                        callbackController.lastOrders(msg, bot, user);
                        break;

                    case 'menu':
                        callbackController.resetMenu(msg, bot);
                        break;

                    case 'newMenu':
                        messagesController.menu(msg, bot);
                        break;

                    default:
                        const actionData = action.split('|');
                        const actionType = actionData.splice(0, 1)[0];

                        switch (actionType) {


                            case 'cancel':
                                callbackController.cancel(msg, bot, actionData);
                                break;

                            case 'orders':
                                callbackController.ordersMenu(msg, bot, actionData);
                                break;


                            default:
                                break;
                        }
                        break;
                }
            }
            else if (!user) {
                await bot.sendMessage(chatId, `Відбулась помилка! Введіть /start ще раз`);
            }
        } catch (error) {
            console.log(error.stack);
        }
    }


    run() {
        this.bot.on('message', (msg) => {
            this.messageHandler(msg, this.bot);
        });
        this.bot.on('callback_query', (cbQuery) => {
            this.callbackHandler(cbQuery, this.bot);
        });
    }
};


const userBot = new UserBot();


export {
    userBot
}