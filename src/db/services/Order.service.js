import { Order } from '../index.js';


class OrderService {

    async getOrderById(orderId) {
        try {
            const order = await Order.findAll({
                where: {
                    id: orderId
                }
            });

            if (!order || order.length === 0) {
                throw new Error('Order not found!');
            }

            return order[0].dataValues;

        } catch (error) {
            console.log('error.stack :>> ', error.stack);
        }
    }


    async getOrdersByUserId(userTelegramId) {
        try {
            const orders = await Order.findAll({
                where: {
                    user_id: userTelegramId
                }
            });

            return orders.map((order) => {
                return order.dataValues;
            });

        } catch (error) {
            console.log('error.stack :>> ', error.stack);
        }
    }


    async getOrders() {
        try {
            const orders = await Order.findAll({});

            return orders.map((order) => {
                return order.dataValues;
            });

        } catch (error) {
            console.log('error.stack :>> ', error.stack);
        }
    }


    async createOrder(sum, user_id) {
        try {
            const newOrder = await Order.create({
                sum,
                user_id
            });

            return newOrder.dataValues;

        } catch (error) {
            console.log('error.stack :>> ', error.stack);
        }
    }


    async updateOrder(orderId, orderData) {
        try {
            const updatedOrder = await Order.update(
                orderData,
                {
                    where: {
                        id: orderId
                    }
                }
            );

            return true;

        } catch (error) {
            console.log('error.stack :>> ', error.stack);
            return false;
        }
    }


    async deleteOrderById(orderId) {
        try {
            await Order.destroy({
                where: {
                    id: orderId
                },
            });

            return true;

        } catch (error) {
            console.log('error.stack :>> ', error.stack);
            return false;
        }
    }

}

const orderService = new OrderService();

export default orderService;