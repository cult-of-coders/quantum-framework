export class Factory {
    constructor(_class) {
        this._class = _class;
    }
    build(...args) {
        return new this._class(...args);
    }
    extend(object) {
        _.extend(this._class, object);
    }
};