interface Panel {
  id: string;
  guild_id: number;
  name: string;
  bot_id: number | null;
  ticket_category_name: string;
  button_text: string;
  button_emoji: string | null;
  welcome_message: string | null;
  ai_context_id: string | null;
}

interface AIContext {
  id: string;
  guild_id: number;
  name: string;
  context_version: number;
  instructions: string | null;
  general_info: string | null;
}
