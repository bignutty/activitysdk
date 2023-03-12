import { RPCCommand, RPCPayload, malformedRequestError, malformedResponseError } from "../constants";

export default class ActivitySDKCommands {

  constructor(private appId: string, private appSecret: string, public sendCommandHandler: <DataObj extends object>(type: RPCCommand, args: Required<RPCPayload<DataObj>["args"]>) => Promise<RPCPayload<DataObj>["data"]>) {}

  async authenticate(scopes: string[], rpcToken?: string) {
    const authorizeRes = await this.sendCommandHandler<AuthorizeResponseData>("AUTHORIZE", {
      client_id: this.appId, rpc_token: rpcToken, scopes
    });
    if (!authorizeRes || !("code" in authorizeRes) || typeof authorizeRes.code !== "string") throw malformedResponseError();
    const authenticateRes: object = await (await fetch("https://discord.com/api/oauth2/token", {
      method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({
        grant_type: "authorization_code",
        code: authorizeRes.code,
        client_id: this.appId,
        client_secret: this.appSecret
      })
    })).json();
    if (!authenticateRes || "error" in authenticateRes || !("access_token" in authenticateRes) || typeof authenticateRes.access_token !== "string") throw malformedRequestError();
    return await this.sendCommandHandler<AuthenticateResponseData>("AUTHENTICATE", {
      access_token: authenticateRes.access_token
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

  async createChannelInvite() {
    return await this.sendCommandHandler("CREATE_CHANNEL_INVITE", {});
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
  voice_states: object[]; //* https://discord.com/developers/docs/resources/voice#voice-state-object
  messages: object[]; //* https://discord.com/developers/docs/resources/channel#message-object
}
export interface GetChannelsResponseData {
  channels: GetChannelResponseData[];
}
