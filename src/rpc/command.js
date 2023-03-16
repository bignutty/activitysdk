// RPC Commands

const { ORIENTATION_LOCK_STATES } = require("../constants");

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
  
  getCurrentUser(){
    return this.sendCommand("GET_USER", {});
  }

  getSelectedVoiceChannel(){
    return this.sendCommand("GET_SELECTED_VOICE_CHANNEL", {});
  }
  
  setActivity(data){
    return this.sendCommand("SET_ACTIVITY", data);
  }

  getGuild(id){
    return this.sendCommand("GET_GUILD", { guild_id: id });
  }

  getGuilds(){
    return this.sendCommand("GET_GUILDS", {});
  }

  getChannel(){
    return this.sendCommand("GET_CHANNEL", { channel_id: id });
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

  setOrientationStateLock(state){
    if(typeof(state) == "string") state = ORIENTATION_LOCK_STATES[state.toUpperCase()]
    return this.sendCommand("SET_ORIENTATION_LOCK_STATE", {
      lock_state: state
    })
  }

  openExternalLink(url){
    return this.sendCommand("OPEN_EXTERNAL_LINK", { url })
  }

  getVoiceSettings(){
    return this.sendCommand("GET_VOICE_SETTINGS", {})
  }

  setVoiceSettings(settings){
    return this.sendCommand("SET_VOICE_SETTINGS", settings)
  }

  selectTextChannel(id){
    return this.sendCommand("SELECT_TEXT_CHANNEL", { channel_id: id })
  }
}

module.exports = ActivitySDKCommands