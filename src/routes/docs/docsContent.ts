export type DocBadge = 'all' | 'admin' | 'staff' | 'free' | 'pro';

export type DocItem = {
  id: string;
  title: string;
  plan?: DocBadge;
  description: string;
  whoCanRun?: string;
  permissions?: string[];
  cooldown?: string;
  whatYouSee?: string;
  steps?: string[];
  errors?: string[];
  tips?: string[];
};

export type DocSection = {
  id: string;
  label: string;
  badge: number;
  tag: string;
  title: string;
  description: string;
  items: DocItem[];
};

export const DOC_SECTIONS: DocSection[] = [
  {
    id: 'getting-started',
    label: 'Getting Started',
    badge: 4,
    tag: 'START',
    title: 'Getting Started',
    description:
      'Everything you need to go from zero to your first AI-powered support ticket in under five minutes.',
    items: [
      {
        id: 'overview',
        title: 'What is Cyron Assistant?',
        plan: 'all',
        description:
          'Cyron Assistant is an AI ticket bot for Discord. It creates private ticket channels, replies using your dashboard knowledge base, and lets staff claim, close, and manage tickets from Discord or the web dashboard.',
        steps: [
          'Invite the bot to your Discord server with Manage Channels, Manage Roles, and Send Messages permissions.',
          'Sign in to the dashboard with Discord and select your server.',
          'Run /setup in Discord to create the Tickets category and Support role.',
          'Create a panel in Dashboard → Panels, link an AI Context, and enable AI Auto-Reply.',
          'Use Send Panel in the dashboard or /sendpanel in Discord to publish the panel embed.',
          'Click Open Ticket — users describe their issue and the bot replies from your knowledge.',
        ],
        tips: [
          'Enable MESSAGE CONTENT INTENT in the Discord Developer Portal — required for the bot to read ticket messages.',
          'Use panel-based tickets (recommended) instead of legacy /create-ticket for full AI and dashboard tracking.',
        ],
      },
      {
        id: 'invite',
        title: 'Invite & permissions',
        plan: 'admin',
        description:
          'The bot needs sufficient Discord permissions to create channels, manage permissions, and send embeds in ticket channels.',
        permissions: ['Manage Channels', 'Manage Roles', 'Send Messages', 'Read Message History', 'Embed Links', 'Use Slash Commands'],
        whoCanRun: 'Server owner or admin when generating the invite link.',
        errors: [
          'Missing Manage Channels — ticket channels cannot be created.',
          'Missing Manage Roles — Support role permissions cannot be applied.',
          'Bot role below Support role — permission overwrites may fail silently.',
        ],
      },
      {
        id: 'dashboard-login',
        title: 'Dashboard login',
        plan: 'all',
        description:
          'Open the dashboard, click Login with Discord, and authorize the app. You will only see servers where you have Manage Server permission and the bot is installed.',
        whatYouSee: 'A grid of your servers. Click one to open the guild sidebar with Panels, AI Contexts, Settings, and more.',
        errors: [
          'Server not listed — log out and sign in again, or confirm the bot is in that server.',
          '403 on save — you need Manage Server on that guild.',
        ],
      },
      {
        id: 'quick-flow',
        title: 'Recommended setup flow',
        plan: 'admin',
        description: 'Follow this order once per server for the smoothest experience.',
        steps: [
          'Discord: /setup',
          'Dashboard: AI Contexts → create a context → add Knowledge entries (pricing, policies, FAQs).',
          'Dashboard: AI Contexts → General Rules → enable and fill tone/safety rules.',
          'Dashboard: Panels → create panel → AI tab → link context + enable AI Auto-Reply.',
          'Dashboard: Panels → Send Panel → pick a channel.',
          'Discord: open a test ticket and send a question covered by your knowledge.',
        ],
      },
    ],
  },
  {
    id: 'discord-setup',
    label: 'Discord Setup',
    badge: 3,
    tag: 'DISCORD',
    title: 'Discord Setup',
    description: 'Slash commands and Discord-side configuration to prepare your server.',
    items: [
      {
        id: 'cmd-setup',
        title: '/setup',
        plan: 'admin',
        description:
          'One-command onboarding. Creates a Tickets category (if missing) and a Support role (if missing). Run this before creating your first ticket.',
        permissions: ['Administrator'],
        whoCanRun: 'Users with Administrator permission.',
        whatYouSee: 'Ephemeral confirmation with category and role mentions.',
        errors: ['Bot missing Manage Channels or Manage Roles.'],
      },
      {
        id: 'cmd-sendpanel',
        title: '/sendpanel',
        plan: 'admin',
        description:
          'Publishes a ticket panel embed with an Open Ticket button in the current channel. If multiple panels exist, a select menu is shown.',
        permissions: ['Administrator'],
        whoCanRun: 'Administrators, or use Dashboard → Panels → Send Panel for channel picker.',
        whatYouSee: 'Panel embed posted in channel; bot stores message ID for tracking.',
        tips: ['Prefer dashboard Send Panel — includes channel list sync and clearer errors.'],
      },
      {
        id: 'cmd-create-ticket',
        title: '/create-ticket (legacy)',
        plan: 'all',
        description:
          'Creates a private channel named ticket-{user_id} under the Tickets category. Still supported but panel tickets are recommended for AI context linking.',
        whoCanRun: 'Any member who can use slash commands in the server.',
        whatYouSee: 'Support Ticket embed with Close, Claim, Add User, Remove User, and Transcript buttons.',
        tips: [
          'Legacy tickets use General Rules for AI when no panel is linked.',
          'Ensure General Rules and knowledge entries exist for AI replies on legacy tickets.',
        ],
      },
      {
        id: 'intents',
        title: 'Privileged intents',
        plan: 'admin',
        description:
          'In the Discord Developer Portal → Bot → Privileged Gateway Intents, enable MESSAGE CONTENT INTENT. Without it the bot cannot read user messages in ticket channels.',
        errors: ['Bot starts but never replies — check MESSAGE CONTENT INTENT and restart the bot container.'],
      },
    ],
  },
  {
    id: 'discord-commands',
    label: 'Ticket Commands',
    badge: 12,
    tag: 'COMMANDS',
    title: 'Ticket slash commands',
    description: 'Staff and user commands available inside registered ticket channels.',
    items: [
      {
        id: 'cmd-ticket-close',
        title: '/ticket close',
        plan: 'staff',
        description: 'Closes the current ticket, notifies the backend, sends a close message, and deletes the channel.',
        permissions: ['Support role or Manage Channels'],
        whoCanRun: 'Support staff. Creators can close if panel setting Users Can Close is enabled.',
      },
      {
        id: 'cmd-ticket-add',
        title: '/ticket add',
        plan: 'staff',
        description: 'Adds a Discord user to the ticket channel with view and send permissions.',
        permissions: ['Support role or Manage Channels'],
      },
      {
        id: 'cmd-ticket-remove',
        title: '/ticket remove',
        plan: 'staff',
        description: 'Removes a user from the ticket channel.',
        permissions: ['Support role or Manage Channels'],
      },
      {
        id: 'cmd-ticket-rename',
        title: '/ticket rename',
        plan: 'staff',
        description: 'Renames the ticket channel (max 100 characters).',
        permissions: ['Support role or Manage Channels'],
      },
      {
        id: 'cmd-ticket-move',
        title: '/ticket move',
        plan: 'staff',
        description: 'Moves the ticket to another category by name.',
        permissions: ['Support role or Manage Channels'],
      },
      {
        id: 'cmd-ticket-claim',
        title: '/ticket claim',
        plan: 'staff',
        description: 'Claims the ticket for the staff member. Updates embed status and may adjust channel permissions based on panel claiming settings.',
        permissions: ['Support role or Manage Channels'],
      },
      {
        id: 'cmd-ticket-unclaim',
        title: '/ticket unclaim',
        plan: 'staff',
        description: 'Releases a claimed ticket and restores default support role permissions.',
        permissions: ['Support role or Manage Channels'],
      },
      {
        id: 'cmd-ticket-priority',
        title: '/ticket priority',
        plan: 'staff',
        description: 'Sets priority to low, medium, high, or urgent. Updates channel name prefix emoji when configured.',
        permissions: ['Support role or Manage Channels'],
      },
      {
        id: 'cmd-ticket-info',
        title: '/ticket info',
        plan: 'all',
        description: 'Shows ticket ID, status, number, creator, claimer, priority, and whether AI auto-reply is active or handed off.',
        whoCanRun: 'Anyone in the ticket channel.',
      },
      {
        id: 'cmd-ticket-ai',
        title: '/ticket ai',
        plan: 'staff',
        description: 'Pause or resume AI auto-reply for this ticket. Pause sets human handoff — staff messages also trigger handoff automatically.',
        permissions: ['Support role or Manage Channels'],
      },
      {
        id: 'cmd-ticket-requestclose',
        title: '/ticket requestclose',
        plan: 'staff',
        description: 'Asks the ticket creator to confirm closure with a button. Optional auto-close after timeout.',
        permissions: ['Support role or Manage Channels'],
      },
      {
        id: 'cmd-new',
        title: '/new',
        plan: 'all',
        description: 'Opens a new support ticket when panels are configured. Shortcut alternative to clicking the panel button.',
        whoCanRun: 'Members who pass panel role requirements and cooldown limits.',
      },
    ],
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    badge: 2,
    tag: 'DASHBOARD',
    title: 'Web dashboard',
    description: 'Manage servers, panels, AI knowledge, and analytics from the browser.',
    items: [
      {
        id: 'dash-home',
        title: 'Server list',
        plan: 'all',
        description:
          'After login, /dashboard shows every guild you can manage where the bot is installed. Select a server to open the guild sidebar.',
        whatYouSee: 'Server cards with name and icon. Empty state if bot is not installed or OAuth guild list is stale — log out and back in.',
      },
      {
        id: 'dash-sidebar',
        title: 'Guild sidebar navigation',
        plan: 'all',
        description: 'Once a server is selected, the left sidebar groups all management pages.',
        steps: [
          'Management: Panels, AI Contexts, Knowledge (legacy tab).',
          'Settings: AI Settings, Embed Customization, Close Settings, Usage Analytics, Ticket Management.',
        ],
      },
    ],
  },
  {
    id: 'panels',
    label: 'Panels',
    badge: 7,
    tag: 'PANELS',
    title: 'Ticket panels',
    description: 'Panels are the embed + button users click to open tickets. Each panel can have its own AI context, embed design, forms, and support hours.',
    items: [
      {
        id: 'panel-create',
        title: 'Create & edit a panel',
        plan: 'admin',
        description: 'Dashboard → Panels → New Panel. Configure tabs: General, AI, Embed, Messages, Forms, Availability, Logging.',
        steps: [
          'General: name, ticket category, channel name format, support roles, limits, cooldowns.',
          'AI: link AI Context, enable AI Auto-Reply (required for bot replies).',
          'Embed: panel button appearance and welcome message design.',
          'Messages: welcome pings, placeholders like {ticket.creator.mention}.',
          'Forms: optional modal questions before ticket creation.',
          'Availability: support hours and closed-state behavior.',
          'Logging: transcript and log channel options.',
        ],
      },
      {
        id: 'panel-send',
        title: 'Send Panel to channel',
        plan: 'admin',
        description:
          'Publishes the panel embed via the bot. Dashboard queues the send over Redis; the bot must be online with REDIS_URL configured.',
        whatYouSee: 'Success toast when queued. Panel embed appears in the chosen Discord channel within a few seconds.',
        errors: [
          'No channels found — bot syncs channels on startup; click refresh in the modal or restart bot.',
          'Failed to send — verify bot container has REDIS_URL and BOT_API_KEY matches API.',
        ],
      },
      {
        id: 'panel-buttons',
        title: 'Ticket channel buttons',
        plan: 'all',
        description:
          'Each ticket shows persistent buttons: Close (confirmation modal), Claim, Add User, Remove User, Transcript. Buttons work after bot restarts via custom_id.',
      },
      {
        id: 'panel-ai-tab',
        title: 'AI tab (critical)',
        plan: 'admin',
        description:
          'Enable AI Auto-Reply and select an AI Context. Without both, the bot will not relay messages to the AI backend for panel tickets.',
        tips: [
          'Link the context that contains your product/pricing knowledge.',
          'General Rules still apply as global tone and safety instructions.',
        ],
      },
    ],
  },
  {
    id: 'ai-contexts',
    label: 'AI & Knowledge',
    badge: 5,
    tag: 'AI',
    title: 'AI contexts & knowledge',
    description: 'Teach the bot what to say. Contexts scope instructions and retrievable knowledge; General Rules apply to every panel.',
    items: [
      {
        id: 'contexts-overview',
        title: 'AI Contexts page',
        plan: 'admin',
        description:
          'Each context has Instructions (always injected), General Info (always available), Problems (Q&A pairs), and Knowledge (searchable articles).',
        tips: [
          'Create separate contexts per product line or language if needed.',
          'Link one context per panel on the Panels → AI tab.',
        ],
      },
      {
        id: 'general-rules',
        title: 'General Rules',
        plan: 'admin',
        description:
          'Server-wide rules: tone, safety, escalation policy. Shown as a special global context. Enable General Rules so the bot lazy-creates default instructions on first reply.',
        steps: [
          'Open AI Contexts → General Rules card.',
          'Toggle enabled and edit Instructions + General Info.',
          'Add Knowledge entries under General Rules for facts that apply to all panels (e.g. company hours).',
        ],
      },
      {
        id: 'knowledge-entries',
        title: 'Adding knowledge entries',
        plan: 'admin',
        description:
          'Add titled entries with main content. Use clear titles (e.g. "1700 Robux Pricing") and include prices in the body. The bot retrieves entries by semantic similarity at reply time.',
        tips: [
          'Keep entries focused — one topic per entry improves retrieval accuracy.',
          'Include numbers and currency symbols in the content for price questions.',
          'After editing knowledge, replies update immediately (embeddings regenerate on save).',
        ],
        errors: [
          'Bot says it does not know — entry may be in a different context than the panel link, or AI Auto-Reply is off.',
          'Wrong answer — add more specific wording matching how users ask questions.',
        ],
      },
      {
        id: 'problems-tab',
        title: 'Problems & solutions',
        plan: 'admin',
        description:
          'Structured problem → solution pairs for common issues. Ideal for "cannot login", "payment failed", etc.',
      },
      {
        id: 'retrieval',
        title: 'How retrieval works',
        plan: 'all',
        description:
          'User messages in ticket channels are sent to the AI backend. The backend searches knowledge in the panel context plus General Rules, builds a grounded prompt, and returns a reply. Greetings get instant template responses without token cost.',
        tips: [
          'Staff messages in a ticket trigger human handoff — AI stops replying so staff can take over.',
          'Low-confidence answers may offer to connect the user with a human agent.',
        ],
      },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    badge: 4,
    tag: 'SETTINGS',
    title: 'Guild settings',
    description: 'Fine-tune AI behavior, embed appearance, close messages, and monitor usage.',
    items: [
      {
        id: 'ai-settings',
        title: 'AI Settings',
        plan: 'admin',
        description: 'Legacy guild system prompt and tone controls. Per-panel contexts override most of this; use AI Contexts for primary configuration.',
      },
      {
        id: 'embed-settings',
        title: 'Embed customization',
        plan: 'admin',
        description: 'Set the default embed color (hex) used in ticket welcome embeds when panels do not override it.',
      },
      {
        id: 'close-settings',
        title: 'Close settings',
        plan: 'admin',
        description:
          'Customize the close embed (title, description, footer) sent before a ticket channel is deleted. Supports placeholders {ticket.closer.mention} and {ticket.closeReason}.',
      },
      {
        id: 'usage-analytics',
        title: 'Usage analytics',
        plan: 'admin',
        description: 'View token usage, request counts, and plan limits. Helps monitor AI costs and upgrade needs.',
      },
    ],
  },
  {
    id: 'tickets',
    label: 'Tickets',
    badge: 2,
    tag: 'TICKETS',
    title: 'Ticket management',
    description: 'Track and manage open tickets from the dashboard.',
    items: [
      {
        id: 'ticket-mgmt',
        title: 'Ticket Management page',
        plan: 'admin',
        description:
          'Dashboard → Ticket Management lists open and recent tickets with channel, user, panel, status, and handoff state.',
      },
      {
        id: 'handoff',
        title: 'Human handoff',
        plan: 'staff',
        description:
          'When support staff sends a message in a ticket, AI auto-reply is permanently disabled for that ticket (human_handoff). Use /ticket ai resume to re-enable if needed.',
      },
    ],
  },
  {
    id: 'troubleshooting',
    label: 'Troubleshooting',
    badge: 6,
    tag: 'HELP',
    title: 'Troubleshooting',
    description: 'Common issues and how to fix them.',
    items: [
      {
        id: 'ts-no-reply',
        title: 'Bot does not reply in tickets',
        plan: 'all',
        description: 'Checklist when messages are ignored.',
        steps: [
          'MESSAGE CONTENT INTENT enabled in Discord Developer Portal.',
          'Bot online (green) in member list.',
          'Panel ticket: AI Auto-Reply ON and AI Context linked.',
          'BOT_API_KEY identical on API and bot containers.',
          'Ticket registered — use panel flow or send a message in legacy ticket to auto-register.',
          'Staff handoff not triggered — staff message disables AI for that ticket.',
        ],
      },
      {
        id: 'ts-wrong-answer',
        title: 'Bot replies but information is wrong',
        plan: 'admin',
        description: 'Usually missing or mis-scoped knowledge.',
        steps: [
          'Confirm knowledge entry exists in the linked AI Context (or General Rules for legacy tickets).',
          'Title and body should mention key terms users type (e.g. "1700 robux", price).',
          'Re-save the knowledge entry to refresh embeddings.',
          'Test with the exact phrasing users use in Discord.',
        ],
      },
      {
        id: 'ts-servers-empty',
        title: 'Dashboard shows no servers',
        plan: 'admin',
        description: 'OAuth guild list or user_guilds table may be empty.',
        steps: [
          'Log out and sign in with Discord again.',
          'Confirm bot is invited to the server.',
          'Run database migrations (alembic upgrade head) on the API container.',
        ],
      },
      {
        id: 'ts-panel-send',
        title: 'Send Panel fails',
        plan: 'admin',
        description: 'Panel queue requires Redis and a running bot.',
        steps: [
          'docker compose logs bot — look for panel_send_poll connected to Redis.',
          'Verify REDIS_URL on both api and bot services.',
          'Ensure channel list loaded in Send Panel modal (refresh button).',
        ],
      },
      {
        id: 'ts-high-tokens',
        title: 'High token usage',
        plan: 'admin',
        description: 'Tokens are consumed on AI replies, not greetings.',
        tips: [
          'Add focused knowledge entries so the bot uses compact RAG instead of long no-KB fallbacks.',
          'Avoid staff testing in live tickets — triggers handoff and extra messages.',
          'Monitor Usage Analytics and upgrade plan if needed.',
        ],
      },
      {
        id: 'ts-deploy',
        title: 'Self-hosted deploy checklist',
        plan: 'admin',
        description: 'VPS Docker deployment reminders.',
        steps: [
          'docker compose up -d --build',
          'docker compose exec api alembic upgrade head',
          'Match BOT_API_KEY, DISCORD_TOKEN, OPENAI_API_KEY in .env',
          'Redeploy frontend to Vercel after pulling changes',
        ],
      },
    ],
  },
];

export const DOC_QUICK_START = [
  {
    title: 'Get the bot running in under 5 minutes',
    subtitle: 'Invite → /setup → create panel → send panel → first ticket opened.',
    duration: '~5 min',
  },
  {
    title: 'Teaching the AI your facts',
    subtitle: 'AI Contexts → add knowledge entries → link panel → test in a ticket channel.',
    duration: '~3 min',
  },
];
