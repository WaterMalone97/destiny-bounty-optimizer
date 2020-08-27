const TokenHelper = require('./helpers/TokenHelper');
const BountyHelper = require('./helpers/BountyHelper');
const SupportHelper = require('./helpers/SupportHelper');

class ServiceContext {
    constructor() {
        this._tokenHelper = new TokenHelper(this);
        this._bountyHelper = new BountyHelper(this);
        this._supportHelper = new SupportHelper(this);
    }

    get tokenHelper() {
        return this._tokenHelper;
    }

    get bountyHelper() {
        return this._bountyHelper;
    }

    get supportHelper() {
        return this._supportHelper;
    }

}

module.exports = ServiceContext;