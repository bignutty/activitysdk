// RPC Commands

class ActivitySDKCommands {
  constructor(send) {
    this.sendCommand = send;
  }

  authorize(data){
    return this.sendCommand("AUTHORIZE", data);
  }
  
  authenticate(data){
    return this.sendCommand("AUTHENTICATE", data);
  }

  setConfig(data){
    return this.sendCommand("SET_CONFIG", data);
  }
  
  getSelectedVoiceChannel(){
    return this.sendCommand("GET_SELECTED_VOICE_CHANNEL", {});
  }
  
  setActivity(data){
    return this.sendCommand("SET_ACTIVITY", data);
  }

  getGuild(){
    return this.sendCommand("GET_GUILD", {});
  }

  getGuilds(){
    return this.sendCommand("GET_GUILDS", {});
  }

  getChannel(){
    return this.sendCommand("GET_CHANNEL", {});
  }

  getChannels(){
    return this.sendCommand("GET_CHANNELS", {});
  }

  createChannelInvite(){
    return this.sendCommand("CREATE_CHANNEL_INVITE", {});
  }

  openInviteDialog(){
    return this.sendCommand("OPEN_INVITE_DIALOG", {})
  }

  encourageHardwareAcceleration(){
    return this.sendCommand("ENCOURAGE_HW_ACCELERATION", {})
  }

  getUserLocale(){
    return this.sendCommand("USER_SETTINGS_GET_LOCALE", {})
  }
}

module.exports = ActivitySDKCommands