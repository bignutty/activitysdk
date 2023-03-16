const EventEmitter = require('eventemitter3');
const uuid = require('uuid')

const { OPCODES, RPC_COMMANDS, RPC_EVENTS } = require('./constants');
const ActivitySDKCommands = require('./rpc/command');

class ActivitySDK extends EventEmitter  {
  constructor(appId) {
    super();
    this.appId = appId;

    this.rpcTarget = window.parent
    if(!this.rpcTarget) this.rpcTarget = window.parent.opener

    this.rpcOrigin = document.referrer
    if(!this.rpcOrigin) this.rpcOrigin = "*"

    this.commandCache = new Map();

    this._handleMessage = (message) => {
      let d = message.data;
      const opcode = d[0];
      if(!OPCODES[opcode]) throw "Invalid opcode recieved: " + opcode
      switch(OPCODES[opcode]){
        case "HANDSHAKE":
          return;
        case "FRAME":
          this._handleFrame(d[1]);
          return;
        case "CLOSE":
          return;
        case "HELLO":
          return;
        default:
          throw "Unable to handle opcode: " + OPCODES[opcode]
      }
    }

    // Sends data to the RPC server via the iframe
    this._sendData = (opcode, data) => {
      const nonce = uuid.v4();
      
      data['nonce'] = nonce;

      this.rpcTarget.postMessage([
        opcode,
        data,
      ], this.rpcOrigin);

      const response = new Promise((resolve, reject) => this.commandCache.set(nonce, { resolve, reject }));
      return response;
    }

    this._sendCommand = (type, data) => {
      if(!RPC_COMMANDS.includes(type)) throw "Invalid RPC Command: " + type

      return this._sendData(OPCODES.FRAME, {
        cmd: type,
        args: data
      })
    }

    this._sendCommandRaw = (type, data) => {
      if(!RPC_COMMANDS.includes(type)) throw "Invalid RPC Command: " + type
      return this._sendData(OPCODES.FRAME, Object.assign({
        cmd: type
      }, data))
    }

    this.commands = new ActivitySDKCommands(this._sendCommand);

    window.addEventListener('message', this._handleMessage);
    this._init();
  }

  // Closes the activity
  close(data){
    window.removeEventListener('message', this._handleMessage);
    this._sendData(OPCODES.CLOSE, { code: data.code, message: data.message })
  }

  // Command Handling
  _resolveCommand(nonce, data){
    const response = this.commandCache.get(nonce)
    if(response) response.resolve(data)

    this.commandCache.delete(nonce)
  }

  _rejectCommand(nonce, data){
    const response = this.commandCache.get(nonce)
    if(response) response.reject(data)
    
    this.commandCache.delete(nonce)
  }

  _handleFrame(data){
    if(data.cmd == "DISPATCH") return this.emit(data.evt, data.data);

    if(!data.nonce) throw "Missing nonce"

    if(data.evt == "ERROR") return this._rejectCommand(data.nonce, data.data);

    return this._resolveCommand(data.nonce, data.data);
  };

  // Handling RPC Events
  async subscribe(event, args, reciever){
    if(!RPC_EVENTS.includes(event)) throw "Invalid RPC Event: " + type

    await this._sendCommandRaw("SUBSCRIBE", {
      evt: event,
      args
    })

    return this.on(event, reciever)
  }
  
  async unsubscribe(event, reciever){
    if(!RPC_EVENTS.includes(event)) throw "Invalid RPC Event: " + type

    await this._sendCommandRaw("UNSUBSCRIBE", {
      evt: event
    })

    return this.off(event, reciever)
  }

  // Helpers
  getPlatform(){
    return this.platform
  }
  
  getChannelId(){
    return this.channelId
  }

  getGuildId(){
    return this.guildId
  }

  // Internal startup logic
  _kill() {
    window.removeEventListener('message', this._handleMessage);
    this.removeAllListeners();
  }

  _handshake(){
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

  _init(){
    const params = new URLSearchParams(window.location.search);
    this.frameId = params.get('frame_id')
    this.instanceId = params.get('instance_id')
    this.platform = params.get('platform')
    
    this.channelId = params.get('channel_id')
    this.guildId = params.get('guild_id')

    if(!this.frameId) throw "Window missing frame_id"
    if(!this.instanceId) throw "Window missing instance_id"
    if(!this.platform) throw "Window missing platform"
    if(!["desktop", "mobile"].includes(this.platform)) throw "Invalid platform"
    
    this._handshake();
  }

}

module.exports = ActivitySDK;