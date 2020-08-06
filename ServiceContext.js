const tokenHelper = require('./tokenHelper');

class ServiceContext {
    constructor() {
        this._tokenHelper = new tokenHelper(this);
    }

    get tokenHelper() {
        return this._tokenHelper;
    }
}

module.exports = ServiceContext;