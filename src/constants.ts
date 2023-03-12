export enum OPCODES { //* same as the object you had.
  "HANDSHAKE",
  "FRAME",
  "CLOSE",
  "HELLO",
};

export const PLATFORM_TYPES = [
  "desktop",
  "mobile"
] as const;

export const RPC_EVENTS = [
  "CURRENT_USER_UPDATE",
  "GUILD_STATUS",
  "GUILD_CREATE",
  "CHANNEL_CREATE",
  "RELATIONSHIP_UPDATE",
  "VOICE_CHANNEL_SELECT",
  "VOICE_STATE_CREATE",
  "VOICE_STATE_DELETE",
  "VOICE_STATE_UPDATE",
  "VOICE_SETTINGS_UPDATE",
  "VOICE_SETTINGS_UPDATE_2",
  "VOICE_CONNECTION_STATUS",
  "SPEAKING_START",
  "SPEAKING_STOP",
  "GAME_JOIN",
  "GAME_SPECTATE",
  "ACTIVITY_JOIN",
  "ACTIVITY_JOIN_REQUEST",
  "ACTIVITY_SPECTATE",
  "ACTIVITY_INVITE",
  "ACTIVITY_PIP_MODE_UPDATE",
  "THERMAL_STATE_UPDATE",
  "ORIENTATION_UPDATE",
  "NOTIFICATION_CREATE",
  "MESSAGE_CREATE",
  "MESSAGE_UPDATE",
  "MESSAGE_DELETE",
  "LOBBY_DELETE",
  "LOBBY_UPDATE",
  "LOBBY_MEMBER_CONNECT",
  "LOBBY_MEMBER_DISCONNECT",
  "LOBBY_MEMBER_UPDATE",
  "LOBBY_MESSAGE",
  "OVERLAY",
  "OVERLAY_UPDATE",
  "ENTITLEMENT_CREATE",
  "ENTITLEMENT_DELETE",
  "USER_ACHIEVEMENT_UPDATE",
  "VOICE_CHANNEL_EFFECT_SEND",
  "VOICE_CHANNEL_EFFECT_RECENT_EMOJI",
  "VOICE_CHANNEL_EFFECT_TOGGLE_ANIMATION_TYPE",
  "READY",
  "ERROR"
] as const;

export const RPC_COMMANDS = [
  "DISPATCH",
  "SET_CONFIG",
  "AUTHORIZE",
  "AUTHENTICATE",
  "GET_GUILD",
  "GET_GUILDS",
  "GET_CHANNEL",
  "GET_CHANNELS",
  "CREATE_CHANNEL_INVITE",
  "GET_RELATIONSHIPS",
  "GET_USER",
  "SUBSCRIBE",
  "UNSUBSCRIBE",
  "SET_USER_VOICE_SETTINGS",
  "SET_USER_VOICE_SETTINGS_2",
  "SELECT_VOICE_CHANNEL",
  "GET_SELECTED_VOICE_CHANNEL",
  "SELECT_TEXT_CHANNEL",
  "GET_VOICE_SETTINGS",
  "SET_VOICE_SETTINGS_2",
  "SET_VOICE_SETTINGS",
  "SET_ACTIVITY",
  "SEND_ACTIVITY_JOIN_INVITE",
  "CLOSE_ACTIVITY_JOIN_REQUEST",
  "ACTIVITY_INVITE_USER",
  "ACCEPT_ACTIVITY_INVITE",
  "OPEN_INVITE_DIALOG",
  "INVITE_BROWSER",
  "DEEP_LINK",
  "CONNECTIONS_CALLBACK",
  "BILLING_POPUP_BRIDGE_CALLBACK",
  "BRAINTREE_POPUP_BRIDGE_CALLBACK",
  "GIFT_CODE_BROWSER",
  "GUILD_TEMPLATE_BROWSER",
  "OVERLAY",
  "BROWSER_HANDOFF",
  "SET_CERTIFIED_DEVICES",
  "GET_IMAGE",
  "CREATE_LOBBY",
  "UPDATE_LOBBY",
  "DELETE_LOBBY",
  "UPDATE_LOBBY_MEMBER",
  "CONNECT_TO_LOBBY",
  "DISCONNECT_FROM_LOBBY",
  "SEND_TO_LOBBY",
  "SEARCH_LOBBIES",
  "CONNECT_TO_LOBBY_VOICE",
  "DISCONNECT_FROM_LOBBY_VOICE",
  "SET_OVERLAY_LOCKED",
  "OPEN_OVERLAY_ACTIVITY_INVITE",
  "OPEN_OVERLAY_GUILD_INVITE",
  "OPEN_OVERLAY_VOICE_SETTINGS",
  "VALIDATE_APPLICATION",
  "GET_ENTITLEMENT_TICKET",
  "GET_APPLICATION_TICKET",
  "START_PURCHASE",
  "START_PREMIUM_PURCHASE",
  "GET_SKUS",
  "GET_ENTITLEMENTS",
  "GET_NETWORKING_CONFIG",
  "NETWORKING_SYSTEM_METRICS",
  "NETWORKING_PEER_METRICS",
  "NETWORKING_CREATE_TOKEN",
  "SET_USER_ACHIEVEMENT",
  "GET_USER_ACHIEVEMENTS",
  "USER_SETTINGS_GET_LOCALE",
  "GET_ACTIVITY_JOIN_TICKET",
  "SEND_GENERIC_EVENT",
  "SEND_ANALYTICS_EVENT",
  "OPEN_EXTERNAL_LINK",
  "CAPTURE_LOG",
  "ENCOURAGE_HW_ACCELERATION",
  "SET_ORIENTATION_LOCK_STATE"
] as const;

//* pov: ottelino hates typescript
//* (something) as const -> infers the type as the literal of this object -> makes it readonly.
//* type LiteralType = "yeepee" | 0 | false
//* type NormalType = string | number | boolean
//*
//? how 2 use:
//? indexing an array type with "number" tells typescript to get the union of all elements in the array. easy to use because autocompletion/intellisense.
//? interface -> object type but compiles faster.
//? you can have functions that work as a type guard

export type PlatformType = (typeof PLATFORM_TYPES)[number];
export type RPCEvent = (typeof RPC_EVENTS)[number];
export type RPCCommand = (typeof RPC_COMMANDS)[number];
export interface RPCPayload<DataObj extends object> {
  cmd: RPCCommand;
  evt: RPCEvent | null;
  nonce: string | null;
  data?: DataObj; // sometimes its type of string for some reason.
  args?: object; // object -> { [key: string]: any }
}

export function malformedRequestError() {
  new Error("Malformed request from client.");
}

export function malformedResponseError() {
  new Error("Malformed response from server.");
}

export function isPlatform(platform: unknown): platform is PlatformType {
  if (!platform) return false;
  if (typeof platform !== "string") return false;
  if (!PLATFORM_TYPES.join(" ").includes(platform)) return false;
  else return true;
}

export function isEvent(event: unknown): event is RPCEvent {
  if (!event) return false;
  if (typeof event !== "string") return false;
  if (!RPC_EVENTS.join(" ").includes(event)) return false;
  else return true;
}

export function isCommand(command: unknown): command is RPCCommand {
  if (!command) return false;
  if (typeof command !== "string") return false;
  if (!RPC_COMMANDS.join(" ").includes(command)) return false;
  else return true;
}

export function isMessage(message: unknown): message is RPCPayload<object> {
  if (!message) return false;
  if (typeof message !== "object") return false;
  if (!("cmd" in message && "nonce" in message && "data" in message)) return false;
  else return true;
}

