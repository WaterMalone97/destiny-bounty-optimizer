const TokenHelper = require('./helpers/TokenHelper');
const BountyHelper = require('./helpers/BountyHelper');

class ServiceContext {
    constructor() {
        this._tokenHelper = new TokenHelper(this);
        this._bountyHelper = new BountyHelper(this);
    }

    get tokenHelper() {
        return this._tokenHelper;
    }

    get bountyHelper() {
        return this._bountyHelper;
    }
}

module.exports = ServiceContext;