import {
  RPCCommand,
  DEFAULT_AUTH_SCOPES,
  ORIENTATION_LOCK_STATES,
  OrientationState
} from "../constants";

export default class ActivitySDKCommands {

  constructor(private appId: string, public sendCommandHandler: <DataObj extends object>(type: RPCCommand, args: object) => Promise<DataObj>) { }

  async authenticate(accessToken: string) {
    return await this.sendCommandHandler<AuthenticateResponseData>("AUTHENTICATE", {
      access_token: accessToken
    });
  }

  async authorize(scopes: readonly string[] = DEFAULT_AUTH_SCOPES, consent: boolean = false) {
    return await this.sendCommandHandler<AuthorizeResponseData>("AUTHORIZE", {
      client_id: this.appId, scopes,
      response_type: "code", state: "",
      prompt: !consent ? "none" : "consent",
    });
  }

  async setConfig(data: object) {
    return await this.sendCommandHandler("SET_CONFIG", data);
  }

  async getSelectedVoiceChannel() {
    return await this.sendCommandHandler("GET_SELECTED_VOICE_CHANNEL", {});
  }

  async setActivity(pid: number, activity: object) {
    return await this.sendCommandHandler("SET_ACTIVITY", {
      pid, activity
    });
  }

  async getGuild(guildId: string, timeout?: number) {
    return await this.sendCommandHandler<GetGuildResponseData>("GET_GUILD", { guild_id: guildId, timeout });
  }

  async getGuilds() {
    return await this.sendCommandHandler<GetGuildsResponseData>("GET_GUILDS", {});
  }

  async getChannel(channelId: string) {
    return await this.sendCommandHandler<GetChannelResponseData>("GET_CHANNEL", { channel_id: channelId });
  }

  async getChannels(guildId: string) {
    return await this.sendCommandHandler<GetChannelsResponseData>("GET_CHANNELS", { guild_id: guildId });
  }

  async createChannelInvite(channelId: string) {
    return await this.sendCommandHandler<CreateChannelInviteResponseData>("CREATE_CHANNEL_INVITE", { channel_id: channelId });
  }

  async openInviteDialog() {
    return await this.sendCommandHandler("OPEN_INVITE_DIALOG", {});
  }

  async encourageHardwareAcceleration() {
    return await this.sendCommandHandler("ENCOURAGE_HW_ACCELERATION", {});
  }

  async getUserLocale() {
    return await this.sendCommandHandler("USER_SETTINGS_GET_LOCALE", {});
  }

  async setOrientationStateLock(state: OrientationState | ORIENTATION_LOCK_STATES) {
    return this.sendCommandHandler("SET_ORIENTATION_LOCK_STATE", {
      lock_state: typeof state === "string" ? ORIENTATION_LOCK_STATES[Object.values(ORIENTATION_LOCK_STATES).indexOf(state) + 1] : state
    })
  }

  async openExternalLink(url: string) {
    return this.sendCommandHandler("OPEN_EXTERNAL_LINK", { url });
  }

  async getVoiceSettings() {
    return this.sendCommandHandler("GET_VOICE_SETTINGS", {});
  }

  async setVoiceSettings(settings: object) {
    return this.sendCommandHandler("SET_VOICE_SETTINGS", settings);
  }

  async selectTextChannel(channelId: string) {
    return this.sendCommandHandler("SELECT_TEXT_CHANNEL", { channel_id: channelId });
  }
}

export interface AuthorizeResponseData {
  code: string;
}
export interface AuthenticateResponseData {
  scopes: string[];
  expires: string;
  user: {
    id: string;
    username: string;
    discriminator: string;
    avatar?: string;
    bot?: boolean;
    system?: boolean;
    mfa_enabled?: boolean;
    banner?: string;
    accent_color?: number;
    locale?: string;
    verified?: boolean;
    email?: string;
    flags?: number;
    premium_type?: number;
    public_flags?: number;
  }
  application: {
    id: string;
    name: string;
    description: string;
    icon: string;
    rpc_origins: string[];
  }
}
export interface GetGuildsResponseData {
  guilds: object[];
}
export interface GetGuildResponseData {
  id: string;
  name: string;
  icon_url: string;
  members: {
    user: AuthenticateResponseData["user"];
    nick?: string;
    avatar?: string;
    roles: string[];
    joined_at: string;
    premium_since?: string;
    deaf: boolean;
    mute: boolean;
    flags: number;
    pending?: string;
    permissions?: string[];
    communication_disabled_until?: string;
  }[];
  vanity_url_code?: string;
}
export interface GetChannelResponseData {
  id: string;
  name?: string;
  type: number;
  guild_id?: string;
  position?: number;
  nsfw?: boolean;
  topic?: string;
  last_message_id?: number;
  user_limit?: number;
  recipients?: AuthenticateResponseData["user"][];
  parent_id?: string;
  permissions?: string;
  flags?: number;
  bitrate?: number;
  /**
   * @see https://discord.com/developers/docs/resources/voice#voice-state-object
   */
  voice_states?: object[];
  /**
   * @see https://discord.com/developers/docs/resources/channel#message-object
   */
  messages: object[];
}
export interface GetChannelsResponseData {
  channels: GetChannelResponseData[];
}

export interface CreateChannelInviteResponseData {
  code: string;
  expires: number;
}
