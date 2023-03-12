import { RPCCommand, RPCPayload } from "../constants";
declare class ActivitySDKCommands {
    private appId;
    sendCommandHandler: (type: RPCCommand, args: object) => void;
    constructor(appId: string, sendCommandHandler: (type: RPCCommand, args: object) => void);
    authorize(scopes: string[], rpcToken: string): void;
    authenticate(accessToken: string): void;
    setConfig(data: RPCPayload): void;
    getSelectedVoiceChannel(): void;
    setActivity(pid: number, activity: object): void;
    getGuild(): void;
    getGuilds(): void;
    getChannel(): void;
    getChannels(): void;
    createChannelInvite(): void;
    openInviteDialog(): void;
    encourageHardwareAcceleration(): void;
    getUserLocale(): void;
}
export default ActivitySDKCommands;
//# sourceMappingURL=command.d.ts.map