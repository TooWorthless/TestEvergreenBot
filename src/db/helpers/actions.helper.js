class ActionsHelper {
    #data;


    constructor() {
        this.#data = {};
    }


    initAction(msg, userId) {
        try {
            if (this.getAction(userId)) {
                return false;
            }

            const action = {
                stage: undefined,
                message: msg,
                params: {}
            };

            this.#data[userId] = action;
            return true;
        } catch (error) {
            console.log(error.stack);
        }
    }


    getAction(id) {
        return this.#data[id];
    }


    setParams(id, params) {
        this.#data[id].params = params;
    }


    setActionStage(id, stage) {
        this.#data[id].stage = stage;
    }


    setMessage(id, msg) {
        this.#data[id].message = msg;
    }


    deleteAction(id) {
        try {
            const action = this.getAction(id);
            if (action) {
                delete this.#data[id];
                return action;
            }
        } catch (error) {
            console.log(error.stack);
        }
    }
}

const actionsHelper = new ActionsHelper;

export default actionsHelper;