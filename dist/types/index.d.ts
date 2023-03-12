import EventEmitter from 'eventemitter3';
import { OPCODES, PlatformType, RPCCommand, RPCEvent, RPCPayload } from './constants';
import ActivitySDKCommands from './rpc/command';
declare class ActivitySDK extends EventEmitter {
    appId: string;
    rpcTarget: Window;
    rpcOrigin: string;
    commands: ActivitySDKCommands;
    commandCache: Map<string, {
        resolve: (value: unknown) => void;
        reject: (reason?: any) => void;
    }>;
    frameId: string;
    instanceId: string;
    platform: PlatformType;
    channelId: string;
    guildId: string;
    constructor(appId: string);
    _handleMessage(message: MessageEvent): void;
    _postRawPayload(opcode: OPCODES, payload: RPCPayload): void;
    sendCommand(type: RPCCommand, args: Required<RPCPayload["args"]>): Promise<unknown>;
    postPayload(type: RPCCommand, payload: Omit<RPCPayload, "nonce" | "cmd">): Promise<unknown>;
    _resolveCommand(nonce: string, data: Required<RPCPayload["data"]>): void;
    _rejectCommand(nonce: string, data: Required<RPCPayload["data"]>): void;
    _handleFrame(resp: RPCPayload): void;
    subscribe(type: RPCEvent, reciever: () => void): Promise<this>;
    unsubscribe(type: RPCEvent, reciever: () => void): Promise<this>;
    getPlatform(): "desktop" | "mobile";
    getChannelId(): string;
    getGuildId(): string;
    _kill(): void;
    _handshake(): void;
    _init(): void;
}
export default ActivitySDK;
//# sourceMappingURL=index.d.ts.map
