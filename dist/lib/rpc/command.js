"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ActivitySDKCommands {
    constructor(appId, sendCommandHandler) {
        this.appId = appId;
        this.sendCommandHandler = sendCommandHandler;
    }
    authorize(scopes, rpcToken) {
        return this.sendCommandHandler("AUTHORIZE", {
            client_id: this.appId, rpc_token: rpcToken, scopes
        });
    }
    authenticate(accessToken) {
        return this.sendCommandHandler("AUTHENTICATE", {
            access_token: accessToken
        });
    }
    setConfig(data) {
        return this.sendCommandHandler("SET_CONFIG", data);
    }
    getSelectedVoiceChannel() {
        return this.sendCommandHandler("GET_SELECTED_VOICE_CHANNEL", { nonce: null });
    }
    setActivity(pid, activity) {
        return this.sendCommandHandler("SET_ACTIVITY", {
            pid, activity
        });
    }
    getGuild() {
        return this.sendCommandHandler("GET_GUILD", { nonce: null });
    }
    getGuilds() {
        return this.sendCommandHandler("GET_GUILDS", { nonce: null });
    }
    getChannel() {
        return this.sendCommandHandler("GET_CHANNEL", { nonce: null });
    }
    getChannels() {
        return this.sendCommandHandler("GET_CHANNELS", { nonce: null });
    }
    createChannelInvite() {
        return this.sendCommandHandler("CREATE_CHANNEL_INVITE", { nonce: null });
    }
    openInviteDialog() {
        return this.sendCommandHandler("OPEN_INVITE_DIALOG", { nonce: null });
    }
    encourageHardwareAcceleration() {
        return this.sendCommandHandler("ENCOURAGE_HW_ACCELERATION", { nonce: null });
    }
    getUserLocale() {
        return this.sendCommandHandler("USER_SETTINGS_GET_LOCALE", { nonce: null });
    }
}
exports.default = ActivitySDKCommands;
//# sourceMappingURL=command.js.map