import EventEmitter from 'eventemitter3';
import { v4 as uuid } from 'uuid';

import {
  OPCODES,
  PlatformType, isPlatform,
  RPCCommand, isCommand,
  RPCEvent, isEvent,
  RPCPayload,
} from './constants';
import ActivitySDKCommands from './rpc/command';

class ActivitySDK extends EventEmitter<RPCEvent> {

  isReady: boolean = false;
  rpcTarget: Window = window.parent.opener || window.parent;
  rpcOrigin: string = document.referrer || "*";

  commands = new ActivitySDKCommands(this.appId, this.appSecret, this.sendCommand.bind(this));
  commandCache = new Map<string, { resolve: (value: RPCPayload<object>["data"]) => void; reject: (reason?: any) => void }>();

  frameId: string;
  instanceId: string;
  platform: PlatformType;
  channelId: string;
  guildId: string;


  constructor(public appId: string, public appSecret: string) {
    super();

    window.addEventListener('message', this._handleMessage.bind(this));

    const params = new URLSearchParams(window.location.search);
    const frameParam = params.get('frame_id');
    const instanceParam = params.get('instance_id');
    const platformParam = params.get('platform');
    if (isPlatform(platformParam)) this.platform = platformParam;
    else throw new Error("Unsupported or invalid platform.");

    const channelParam = params.get('channel_id');
    const guildParam = params.get('guild_id');

    if (!frameParam) throw new Error("Window missing frame_id"); else this.frameId = frameParam;
    if (!instanceParam) throw new Error("Window missing instance_id"); else this.instanceId = instanceParam;
    if (!channelParam) throw new Error("Window missing frame_id"); else this.channelId = channelParam;
    if (!guildParam) throw new Error("Window missing frame_id"); else this.guildId = guildParam;

    this._init();
  }

  private _handleMessage(message: MessageEvent) {
    if (typeof message.data !== "object") {
      console.log("Recieved message: ", message.data);
      return;
    }
    const opcode = message.data[0];
    const payload = message.data[1];
    if (!(opcode in OPCODES)) throw new Error("Invalid opcode recieved: " + opcode);
    console.log("Recieved opcode " + OPCODES[opcode], message);
    switch (OPCODES[opcode]) {
      case "HANDSHAKE":
        return;
      case "FRAME":
        this._handleFrame(payload);
        return;
      case "CLOSE":
        return;
      case "HELLO":
        this.isReady = true;
        return;
      default:
        throw "Unable to handle opcode: " + OPCODES[opcode];
    }
  }

  private _postRawPayload(opcode: OPCODES, payload: RPCPayload<object>) {
    console.log("post " + OPCODES[opcode] + " with", payload);
    this.rpcTarget.postMessage([opcode, payload], this.rpcOrigin);
  }

  sendCommand<DataObj extends object>(type: RPCCommand, args: Required<RPCPayload<object>["args"]>): Promise<RPCPayload<DataObj>["data"]> {
    if (!isCommand(type)) throw new Error("Invalid RPC Command: " + type);
    const nonce = uuid();

    this._postRawPayload(OPCODES.FRAME, {
      nonce, args,
      cmd: type, evt: null,
    });

    return new Promise<RPCPayload<object>["data"]>((resolve, reject) => this.commandCache.set(nonce, { resolve, reject })) as Promise<RPCPayload<DataObj>["data"]>;
  }

  postPayload(payload: Omit<RPCPayload<object>, "nonce">) {
    if (!isCommand(payload.cmd)) throw new Error("Invalid RPC Command: " + payload.cmd);
    if (payload.evt) if (!isEvent(payload.evt)) throw new Error("Invalid RPC Event: " + payload.evt);
    const nonce = uuid();

    this.rpcTarget.postMessage([
      OPCODES.FRAME,
      { nonce, ...payload },
    ], this.rpcOrigin);

    return new Promise((resolve, reject) => this.commandCache.set(nonce, { resolve, reject }));
  }

  // Command Handling
  private _resolveCommand<DataObj extends object>(nonce: string, data: Required<RPCPayload<DataObj>["data"]>) {
    const response = this.commandCache.get(nonce);
    if (response) response.resolve(data);

    this.commandCache.delete(nonce);
  }

  private _rejectCommand<DataObj extends object>(nonce: string, data: Required<RPCPayload<DataObj>["data"]>) {
    const response = this.commandCache.get(nonce);
    if (response) response.reject(data);

    this.commandCache.delete(nonce);
  }

  private _handleFrame(resp: RPCPayload<object>) {
    console.log("Handle frame (response) -> ", resp);
    if (resp.cmd === "DISPATCH") {
      if (!isEvent(resp.evt)) throw new Error("Undefined event in DISPATCH command.");
      this.emit(resp.evt, resp.data);
      return;
    }

    if (!resp.nonce) throw new Error("Missing nonce");
    if (resp.evt === "ERROR") this._rejectCommand(resp.nonce, resp.data);
    else this._resolveCommand(resp.nonce, resp.data);
  };

  // Handling RPC Events
  async subscribe(type: RPCEvent, reciever: () => void) {
    if (!isEvent(type)) throw new Error("Invalid RPC Event: " + type);

    await this.postPayload({
      evt: type, cmd: "SUBSCRIBE"
    });

    return this.on(type, reciever);
  }

  async unsubscribe(type: RPCEvent, reciever: () => void) {
    if (!isEvent(type)) throw new Error("Invalid RPC Event: " + type);

    await this.postPayload({
      evt: type, cmd: "UNSUBSCRIBE"
    });

    return this.off(type, reciever);
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
  kill() {
    window.removeEventListener('message', this._handleMessage.bind(this));
    this.removeAllListeners();
  }

  private _handshake() {
    this.isReady = false;
    this.rpcTarget.postMessage([
      OPCODES.HANDSHAKE,
      {
        v: 1,
        encoding: 'json',
        client_id: this.appId,
        frame_id: this.frameId,
      },
    ], this.rpcOrigin);
  }

  private _init() {
    this._handshake();
  }

}

export default ActivitySDK;
