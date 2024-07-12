class CommandsController {
    async start(msg, bot, userData) {
        try {
            const chatId = msg.chat.id;
            await bot.sendMessage(
                chatId, 
                `*Вітаємо, ${userData.name}, чим я можу допомогти!*`,
                {
                    parse_mode: 'Markdown',
                    reply_markup: JSON.stringify({
                        keyboard: [
                            ['⚙️Меню']
                        ],
                        resize_keyboard: true
                    })
                }
            );
    
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
}

const commandsController = new CommandsController();


export default commandsController;