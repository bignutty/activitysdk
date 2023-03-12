"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const eventemitter3_1 = tslib_1.__importDefault(require("eventemitter3"));
const uuid_1 = tslib_1.__importDefault(require("uuid"));
const constants_1 = require("./constants");
const command_1 = tslib_1.__importDefault(require("./rpc/command"));
class ActivitySDK extends eventemitter3_1.default {
    constructor(appId) {
        super();
        this.appId = appId;
        this.rpcTarget = window.parent.opener || window.parent;
        this.rpcOrigin = document.referrer || "*";
        this.commands = new command_1.default(this.appId, this.sendCommand);
        this.commandCache = new Map();
        window.addEventListener('message', this._handleMessage);
        const params = new URLSearchParams(window.location.search);
        const frameParam = params.get('frame_id');
        const instanceParam = params.get('instance_id');
        const platformParam = params.get('platform');
        if ((0, constants_1.isPlatform)(platformParam))
            this.platform = platformParam;
        else
            throw new Error("Unsupported or invalid platform.");
        const channelParam = params.get('channel_id');
        const guildParam = params.get('guild_id');
        if (!frameParam)
            throw new Error("Window missing frame_id");
        else
            this.frameId = frameParam;
        if (!instanceParam)
            throw new Error("Window missing instance_id");
        else
            this.instanceId = instanceParam;
        if (!channelParam)
            throw new Error("Window missing frame_id");
        else
            this.channelId = channelParam;
        if (!guildParam)
            throw new Error("Window missing frame_id");
        else
            this.guildId = guildParam;
        this._init();
    }
    _handleMessage(message) {
        const opcode = message.data[0];
        const payload = message.data[1];
        if (!(opcode in constants_1.OPCODES))
            throw new Error("Invalid opcode recieved: " + opcode);
        switch (constants_1.OPCODES[opcode]) {
            case "HANDSHAKE":
                return;
            case "FRAME":
                this._handleFrame(payload);
                return;
            case "CLOSE":
                return;
            case "HELLO":
                return;
            default:
                throw "Unable to handle opcode: " + constants_1.OPCODES[opcode];
        }
    }
    _postRawPayload(opcode, payload) {
        this.rpcTarget.postMessage([opcode, payload], this.rpcOrigin);
    }
    sendCommand(type, args) {
        if (!(0, constants_1.isCommand)(type))
            throw new Error("Invalid RPC Command: " + type);
        const nonce = uuid_1.default.v4();
        this._postRawPayload(constants_1.OPCODES.FRAME, { nonce, cmd: type, args });
        return new Promise((resolve, reject) => this.commandCache.set(nonce, { resolve, reject }));
    }
    postPayload(type, payload) {
        if (!(0, constants_1.isCommand)(type))
            throw new Error("Invalid RPC Command: " + type);
        const nonce = uuid_1.default.v4();
        this.rpcTarget.postMessage([
            constants_1.OPCODES.FRAME,
            Object.assign({ nonce, cmd: type }, payload),
        ], this.rpcOrigin);
        return new Promise((resolve, reject) => this.commandCache.set(nonce, { resolve, reject }));
    }
    // Command Handling
    _resolveCommand(nonce, data) {
        const response = this.commandCache.get(nonce);
        if (response)
            response.resolve(data);
        this.commandCache.delete(nonce);
    }
    _rejectCommand(nonce, data) {
        const response = this.commandCache.get(nonce);
        if (response)
            response.reject(data);
        this.commandCache.delete(nonce);
    }
    _handleFrame(resp) {
        if (resp.cmd === "DISPATCH") {
            this.emit(`${resp.evt}`, resp.data);
        }
        if (!resp.nonce)
            throw new Error("Missing nonce");
        if (resp.evt === "ERROR")
            this._rejectCommand(resp.nonce, resp.data);
        else
            this._resolveCommand(resp.nonce, resp.data);
    }
    ;
    // Handling RPC Events
    subscribe(type, reciever) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!(0, constants_1.isEvent)(type))
                throw new Error("Invalid RPC Event: " + type);
            yield this.postPayload("SUBSCRIBE", {
                evt: type
            });
            return this.on(type, reciever);
        });
    }
    unsubscribe(type, reciever) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!(0, constants_1.isEvent)(type))
                throw new Error("Invalid RPC Event: " + type);
            yield this.postPayload("UNSUBSCRIBE", {
                evt: type
            });
            return this.off(type, reciever);
        });
    }
    // Helpers
    getPlatform() {
        return this.platform;
    }
    getChannelId() {
        return this.channelId;
    }
    getGuildId() {
        return this.guildId;
    }
    // Internal startup logic
    _kill() {
        window.removeEventListener('message', this._handleMessage);
        this.removeAllListeners();
    }
    _handshake() {
        this.rpcTarget.postMessage([
            constants_1.OPCODES.HANDSHAKE,
            {
                v: 1,
                encoding: 'json',
                client_id: this.appId,
                frame_id: this.frameId,
            },
        ], this.rpcOrigin);
    }
    _init() {
        this._handshake();
    }
}
exports.default = ActivitySDK;
//# sourceMappingURL=index.js.map
