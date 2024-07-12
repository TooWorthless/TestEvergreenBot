class MessagesController {
    async menu(msg, bot) {
        try {
            const chatId = msg.chat.id;

            await bot.sendMessage(
                chatId,
                `*Головне меню*`,
                {
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

            await bot.sendMessage(
                chatId,
                `*Evergreen*\n\n` +
                `\`Evergreen\` — продуктово-сервісна компанія, що спеціалізується на розробці IT проектів і продуктів «з нуля», запуску цих проектів у бізнес замовника та подальшому розвитку.`,
                {
                    parse_mode: 'Markdown',
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                        ]
                    })
                }
            ); 
        } catch (error) {
            console.log(error.stack);
        }
    }

}

const messagesController = new MessagesController();


export default messagesController;