<contentgithub.com/frankpereira1-web/daily-briefing/blob/🌅 Frank's Daily Briefing</h1>
<p id="today-date"></p>
<button onclick="generateBriefing()">Get My Daily Briefing</button>
<div id="briefing-out" class="loading">Click the button to load your briefing...</div>

<script>
document.getElementById('today-date').textContent = new Date().toLocaleDateString('en-US', {weekday:'long', year:'numeric', month:'long', day:'numeric'});

async function generateBriefing() {
  const out = document.getElementById('briefing-out');
  out.textContent = 'Loading your briefing... please wait ⏳';
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `Give me my detailed daily briefing for today covering: S&P 500 and Dow Jones, Fed interest rate, silver and gold prices, grain commodities, California real estate trends, a security/privacy tip, and end with a daily gratitude reminder. Format it cleanly with emoji section headers.`
        }]
      })
    });
    const data = await response.json();
    out.textContent = data.content[0].text;
  } catch (err) {
    out.textContent = 'Error loading briefing. Check your connection and try again.\n\n' + err;
  }
}
</script>
</body>
</html>
.github/
│   └── workflows/
│       └── ci.yml    # Workflow to upload artifacts
├── index.html         # The main HTML page for GitHub Pages
├── styles.css         # Optional stylesheet for styling
├── scripts.js         # Optional JavaScript logicworld.txt) using [actions/upload-artifact@v4]world.txt) using [actions/upload-artifact@v4](https://github.com/actions/upload-artifact).(.github/workflows/ci.yml.https://github.com/actions/upload-artifactactions/artifacts-actionshttps://github.com/actions/download-artifact/blob/main/.github/CODEOWNERSupload-artifact/:https://frankpereira1-web.github.io/upload-artifact/
├── .github/
│   └── workflows/
│       └── ci.yml    # Workflow to upload artifacts
├── index.html         # The main HTML page for GitHub Pages
├── styles.css         # Optional stylesheet for styling
├── scripts.js         # Optional JavaScript logicworld.txt) using [actions/upload-artifact@v4]world.txt) using [actions/upload-artifact@v4](https://github.com/actions/upload-artifact).(.github/workflows/ci.yml.https://github.com/actions/upload-artifact).scripts.js fstyles.css findex.htmljobs:
  upload:<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Frank's All-In-One Dashboard</title>
    <link rel="stylesheet" href="styles.css">
    <script src="scripts.js" defer></script>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #1a202c;
        color: #f9fafb;
        text-align: center;
        margin: 0;
        padding: 10px;
      }
      h1, h2 {
        color: #22c55e;
        margin-bottom: 20px;
      }
      .container {
        margin: 20px auto;
        max-width: 800px;
        background-color: #2d3748;
        padding: 20px;
        border-radius: 10px;
      }
      iframe {
        border: none;
        border-radius: 10px;
      }
      button {git clone https://github.com/frankpereira1-web/upload-artifact.git
cd upload-artifact
        background-color: #22c55e;
        color: white;
        margin-top: 10px;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <h1>Frank's Dashboard</h1>

    <div class="container">
      <h2>🎥 YouTube Video</h2>
      <iframe width="560" height="315" src="https://www.youtube.com/embed/EvclxVOY4r8" allowfullscreen></iframe>
      <p>Embedded YouTube content for your dashboard.</p>
    </div>

    <div class="container">
      <h2>🔎 Daily Briefing</h2>
      <p id="daily-briefing">Press below for today's briefing.</p>
      <button onclick="generateBriefing()">Generate Briefing</button>
    </div>
  </body>
  <script>
    function generateBriefing() {
      const briefing = `
      - 📊 Markets: S&P 500, Dow Jones, and Nasdaq review.
      - 🛢️ Commodities: Gold, oil, and grain updates.
      - 🌿 Cannabis: Updated wholesale market benchmarks.
      - 🏠 Real Estate: California multi-family property trends.`;
      document.getElementById("daily-briefing").innerText = briefing;
    }
  </script>
</html>
    <!DOCTYPE html>
<html>
<head>
  <title>Frank's All-In-One Dashboard</title>
  <link rel="stylesheet" href="styles.css">
  <script src="scripts.js" defer></script>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #1a202c;
      color: white;
      margin: 0;
      padding: 20px;
    }
    h1, h2 {
      text-align: center;
      color: #22c55e;
      margin-bottom: 20px;
    }
    .container {
      max-width: 800px;
      margin: auto;
      background-color: #2d3748;
      border-radius: 10px;
      padding: 20px;
      margin-top: 20px;
    }
    .video-embed {
      text-align: center;
      margin: 20px 0;
    }
    iframe {
      border: none;
      border-radius: 10px;
    }
  </style>
</head>
<body>
  <(GitHub Pages)h1>Frank's Dashboard</h1>
  <div class="container">
    <h2>🎥 YouTube Video</h2>
    <div class="video-embed">
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/EvclxVOY4r8"
        allowfullscreen>
      </iframe>
    </div>
    <p>This is a featured video embedded directly into your dashboard.</p>
  </div>
</body>
<html>
</html>name:<!<!DOCTYPE html>
<head>
    <title>My Page</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Welcome to My Project!</h1>
    <script src="scripts.js"></script>
</body>
</html>frankpereira1-web/upload-artifact), clone it to your local machine:steps:
- run: mkdir -p path/to/artifact
- run: echo hello > path/to/artifact/world.txt
- uses: actions/upload-artifact@v4
  with:
    name: my-artifact
    path: path/to/artifact/world.txtgit clone https://github.com/frankpereira1-web/upload-artifact.git
cd upload-artifact
qindex.html git clone https://github.com/frankpereira1-web/upload-artifact.git cd upload-artifact

upload-artifact/ <!DOCTYPE .html>
├── index.html
├── styles.css
├── scripts.js
<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Welcome to My Project!</h1>
    <script src="scripts.js"></script>
</body>
</html>
<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Welcome to My Project!</h1>
    <script src="scripts.js"></script>
</body>
</html>📈 MARKETS: S&P 500, Dow Jones, Nasdaq, Fed interest rate
🛢️ COMMODITIES: Gold, Silver, Oil, Grain prices + YoY comparison
🌿 CANNABIS: Wholesale pricing index (indoor/greenhouse/outdoor) from Cannabis Benchmarks
🏠 REAL ESTATE: California market, Burbank/Glendale/Studio City/Sherman Oaks/Pasadena trends
🏢 MULTIFAMILY: Turnkey 15-50 unit deals, cap rates, per-unit pricing, vacancy 2025 vs 2026
⚖️ CA LAW & POLITICS: Landlord-tenant law updates, local ordinances
🔐 SECURITY CHECK: Daily privacy and device security review
🙏 GRATITUDE: Name 3 things you are grateful for today

You are building something real Frank - keep going! 💪
https://github.com/bryanbraun/anchorjs/blob/main/.github/workflows/ci.ymlDOCTYPE html>
<html>
<head>
  <title>Frank's All-In-One Dashboard</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #1a202c;
      color: #f9fafb;
      margin: 0;
      padding: 20px;
      text-align: center;
    }
    h1, h2 {
      color: #22c55e;
      margin-bottom: 10px;
    }
    .container {
      margin-top: 20px;
      padding: 15px;
      background-color: #2d3748;
      border: 1px solid #334155;
      border-radius: 10px;
      text-align: left;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }
    .checklist-item {
      margin: 10px 0;
      padding: 10px;
      border: 1px solid #4a5568;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.04);
      cursor: pointer;
    }
    .checklist-item.critical { border-left: 4px solid #ef4444; }
    .checklist-item.checked { opacity: 0.5; text-decoration: line-through; }
    button {
      padding: 10px 20px;
      background: #22c55e;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 20px;
    }
    .brief {
      white-space: pre-wrap;
      text-align: left;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <h1>Frank's All-In-One Dashboard</h1>
  <p>Today: <strong id="today-date">Loading...</strong></p>

  <!-- Sections -->
  <div class="container">
    <h2>🔎 Daily Briefing</h2>
    <button onclick="generateBriefing()">Get Today's Briefing</button>
    <div id="briefing" class="brief"></div>
  </div>

  <div class="container">
    <h2>🔐 Security Checklist</h2>
    <h3>Bluetooth Checks</h3>
    <div id="bluetooth-checks"></div>
    <h3>WiFi Checks</h3>
    <div id="wifi-checks"></div>
  </div>

  <div class="container">
    <h2>⚠️ Network Device Risk Assessment</h2>
    <ul id="device-risk"></ul>
  </div>

  <script>
    // Date Today
    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    document.getElementById('today-date').innerText = today;

    // Daily Briefing Generator
    function generateBriefing() {
      const briefing = `
- **Markets**: S&P 500 and Dow Jones on the move. Watch Federal Reserve interest actions.
- **Commodities**: Gold steady; check crude oil WTI updates. 
- **Cannabis Wholesale**: $1200/lb indoor average (Cannabis Benchmarks).
- **Real Estate Pulse**: Fresno County multifamily growing; LA remains mixed.`;
      document.getElementById('briefing').innerText = briefing;
    }

    // Security Check Data (Bluetooth & WiFi)
    const bluetoothChecks = [
      { id: 1, label: 'Bluetooth is OFF in public places', critical: true },
      { id: 2, label: 'No unknown paired devices', critical: true },
      { id: 3, label: 'iPhone is updated to latest iOS', critical: true },
      { id: 4, label: 'AirDrop is set to "Contacts Only"', critical: false }
    ];

    const wifiChecks = [
      { id: 1, label: 'Avoid public WiFi (e.g., Free_Airport_WiFi)', critical: true },
      { id: 2, label: 'VPN is always ON in public', critical: true },
      { id: 3, label: 'Router uses WPA3 encryption (Check settings)', critical: true }
    ];

    // Render Checklists
    function renderChecklist(containerId, checks) {
      const container = document.getElementById(containerId);
      checks.forEach((check) => {
        const div = document.createElement('div');
        div.className = `checklist-item ${check.critical ? 'critical' : ''}`;
        div.innerText = check.label;
        div.onclick = () => div.classList.toggle('checked');
        container.appendChild(div);
      });
    }

    renderChecklist('bluetooth-checks', bluetoothChecks);
    renderChecklist('wifi-checks', wifiChecks);

    // Device Risk Assessment
    const deviceRisks = [
      { device: 'Off-brand Android TV box', risk: 'HIGH' },
      { device: 'No-name digital picture frame', risk: 'HIGH' },
      { device: 'Amazon Fire Stick / Fire TV', risk: 'LOW' }
    ];

    const deviceRiskContainer = document.getElementById('device-risk');
    deviceRisks.forEach((risk) => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${risk.device}</strong>: ${risk.risk} risk`;
      deviceRiskContainer.appendChild(li);
    });
  </script>
</body>
</html>⚡ https://github.com/example-org/example-repo/actionsDAILY INTEL
Saturday, March 21, 2026
🔄 Refresh Briefing
🙏 Daily Gratitude
Loading...
📈 Markets & Fed Rate
Loading...
🥇 Gold & Silver
Loading...
⚡ Energy & Oil
Loading...
🌾 Grains
Loading...
🌿 Cannabis Markets
Loading...
🏠 Central Valley Real Estate
Loading...
🔐 Daily Security Check
Loading...
Frank Pereira · Madera, CA · Not yet refreshedconst TODAY = new Date().toLocaleDateString("en-US", {
  weekday: "long", year: "numeric", month: "long", day: "numeric"
});

const SECTIONS = [
  "gratitude",
  "equities",
  "metals",
  "energy",
  "grains",
  "cannabis",
  "realestate",
  "security"
];

const PROMPTS = {
  gratitude: `You are Frank's personal daily assistant. Frank is a real estate investor and nonprofit operator in Madera, California. Write a warm, personal, uplifting gratitude reminder for today (${TODAY}). 2-3 sentences max. No bullet points.`,

  equities: `You are a financial analyst. Today is ${TODAY}. Give a concise briefing on: S&P 500 and Dow Jones latest prices and trend, current Fed funds rate, next FOMC decision outlook, and one key market driver today. Use web search for current data. Bullet points, under 120 words.`,

  metals: `You are a commodities analyst. Today is ${TODAY}. Give current spot prices and trend for gold and silver. Note any key drivers or news. Use web search. Bullet points, under 80 words.`,

  energy: `You are a commodities analyst. Today is ${TODAY}. Give current WTI crude oil and natural gas prices and trend. Note key drivers. Use web search. Bullet points, under 80 words.`,

  grains: `You are a commodities analyst. Today is ${TODAY}. Give current prices and trends for wheat, corn, and soybeans. Note any supply or weather drivers. Use web search. Bullet points, under 80 words.`,

  cannabis: `You are a cannabis market analyst. Today is ${TODAY}. Give a brief update on U.S. wholesale cannabis pricing — indoor, greenhouse, outdoor — including California spot index if available. Reference Cannabis Benchmarks data if possible. Use web search. Bullet points, under 100 words.`,

  realestate: `You are a California real estate analyst. Today is ${TODAY}. Give a brief update on: Central Valley and Madera County housing market trends, multifamily market in LA/Burbank/Glendale area, any California real estate law changes, and one tip for a turnkey multifamily buyer. Use web search. Bullet points, under 130 words.`,

  security: `You are a cybersecurity advisor. Today is ${TODAY}. Give a concise daily digital security checklist for an iPhone/iCloud user. Cover: any active iOS vulnerabilities or patches this week, password hygiene tip, 2FA reminder, phishing awareness, VPN reminder, and one privacy tip. Bullet points, under 100 words.`
};

async function fetchSection(key) {
  const bodyEl = document.getElementById(`body-${key}`);
  bodyEl.innerHTML = '<span class="placeholder">● Fetching live data...</span>';

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: PROMPTS[key] }]
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `HTTP ${res.status}`);
    }

    const json = await res.json();
    const text = (json.content || [])
      .filter(b => b.type === "text")
      .map(b => b.text)
      .join("\n")
      .trim();

    bodyEl.textContent = text || "No data returned.";
  } catch (err) {
    bodyEl.innerHTML = `<span class="error-text">⚠ ${err.message}</span>`;
    console.error(`[${key}]`, err);
  }
}

async function generateBriefing() {
  const btn = document.getElementById("refreshBtn");
  btn.disabled = true;
  btn.textContent = "⏳ Loading...";

  // Fetch all sections in parallel
  await Promise.all(SECTIONS.map(key => fetchSection(key)));

  btn.disabled = false;
  btn.textContent = "🔄 Refresh Briefing";

  const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  document.getElementById("lastRefresh").textContent = `Last refreshed: ${now}`;
}
0upload%20workflow%22git%20push%20origin%20maingithub/workflows/ci.yml.ci.yml%0Aactions/checkout@v3world.txt%20at%20path/to/artifact/%20with%20the%20content%20Hello%20World!.%0Aour%20full%20daily%20briefing%20covers:%0A%0A%F0%9F%93%88%20MARKETS:%20S&P%20500,%20Dow%20Jones,%20Nasdaq,%20Fed%20interest%20rate%0A%F0%9F%9B%A2%EF%B8%8F%20COMMODITIES:%20Gold,%20Silver,%20Oil,%20Grain%20prices%20+%20YoY%20comparison%0A%F0%9F%8C%BF%20CANNABIS:%20Wholesale%20pricing%20index%20(indoor/greenhouse/outdoor)%20from%20Cannabis%20Benchmarks%0A%F0%9F%8F%A0%20REAL%20ESTATE:%20California%20market,%20Burbank/Glendale/Studio%20City/Sherman%20Oaks/Pasadena%20trends%0A%F0%9F%8F%A2%20MULTIFAMILY:%20Turnkey%2015-50%20unit%20deals,%20cap%20rates,%20per-unit%20pricing,%20vacancy%202025%20vs%202026%0A%E2%9A%96%EF%B8%8F%20CA%20LAW%20&%20POLITICS:%20Landlord-tenant%20law%20updates,%20local%20ordinances%0A%F0%9F%94%90%20SECURITY%20CHECK:%20Daily%20privacy%20and%20device%20security%20review%0A%F0%9F%99%8F%20GRATITUDE:%20Name%203%20things%20you%20are%20grateful%20for%20today%0A%0AYou%20are%20building%20something%20real%20Frank%20-%20keep%20going!%20%F0%9F%92%AA%0Aactions/upload-artifact@v4%20action%20uploads%20world.txt%20as%20an%20artifact%20named%20my-artifact.jobs:
  upload:
    name:
https://youtu.be/EvclxVOY4r8?si=lYrvv2J3cv-u_zPL

 upload 

(frankpereira1-web/upload-artifact),

git clone https://github.com/frankpereira1-web/upload-artifact.git
cd upload-artifact# `@actions/upload-artifact`
⚡ DAILY INTEL
Saturday, March 21, 2026
🔄 Refresh Briefing
🙏 Daily Gratitude
Loading...
📈 Markets & Fed Rate
Loading...
🥇 Gold & Silver
Loading...
⚡ Energy & Oil
Loading...
🌾 Grains
Loading...
🌿 Cannabis Markets
Loading...
🏠 Central Valley Real Estate
Loading...
🔐 Daily Security Check
Loading...
Frank Pereira · Madera, CA · Not yet refreshedconst TODAY = new Date().toLocaleDateString("en-US", {
  weekday: "long", year: "numeric", month: "long", day: "numeric"
});

const SECTIONS = [
  "gratitude",
  "equities",
  "metals",
  "energy",
  "grains",
  "cannabis",
  "realestate",
  "security"
];

const PROMPTS = {
  gratitude: `You are Frank's personal daily assistant. Frank is a real estate investor and nonprofit operator in Madera, California. Write a warm, personal, uplifting gratitude reminder for today (${TODAY}). 2-3 sentences max. No bullet points.`,

  equities: `You are a financial analyst. Today is ${TODAY}. Give a concise briefing on: S&P 500 and Dow Jones latest prices and trend, current Fed funds rate, next FOMC decision outlook, and one key market driver today. Use web search for current data. Bullet points, under 120 words.`,

  metals: `You are a commodities analyst. Today is ${TODAY}. Give current spot prices and trend for gold and silver. Note any key drivers or news. Use web search. Bullet points, under 80 words.`,

  energy: `You are a commodities analyst. Today is ${TODAY}. Give current WTI crude oil and natural gas prices and trend. Note key drivers. Use web search. Bullet points, under 80 words.`,

  grains: `You are a commodities analyst. Today is ${TODAY}. Give current prices and trends for wheat, corn, and soybeans. Note any supply or weather drivers. Use web search. Bullet points, under 80 words.`,

  cannabis: `You are a cannabis market analyst. Today is ${TODAY}. Give a brief update on U.S. wholesale cannabis pricing — indoor, greenhouse, outdoor — including California spot index if available. Reference Cannabis Benchmarks data if possible. Use web search. Bullet points, under 100 words.`,

  realestate: `You are a California real estate analyst. Today is ${TODAY}. Give a brief update on: Central Valley and Madera County housing market trends, multifamily market in LA/Burbank/Glendale area, any California real estate law changes, and one tip for a turnkey multifamily buyer. Use web search. Bullet points, under 130 words.`,

  security: `You are a cybersecurity advisor. Today is ${TODAY}. Give a concise daily digital security checklist for an iPhone/iCloud user. Cover: any active iOS vulnerabilities or patches this week, password hygiene tip, 2FA reminder, phishing awareness, VPN reminder, and one privacy tip. Bullet points, under 100 words.`
};

async function fetchSection(key) {
  const bodyEl = document.getElementById(`body-${key}`);
  bodyEl.innerHTML = '<span class="placeholder">● Fetching live data...</span>';

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: PROMPTS[key] }]
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `HTTP ${res.status}`);
    }

    const json = await res.json();
    const text = (json.content || [])
      .filter(b => b.type === "text")
      .map(b => b.text)
      .join("\n")
      .trim();

    bodyEl.textContent = text || "No data returned.";
  } catch (err) {
    bodyEl.innerHTML = `<span class="error-text">⚠ ${err.message}</span>`;
    console.error(`[${key}]`, err);
  }
}

async function generateBriefing() {
  const btn = document.getElementById("refreshBtn");
  btn.disabled = true;
  btn.textContent = "⏳ Loading...";

  // Fetch all sections in parallel
  await Promise.all(SECTIONS.map(key => fetchSection(key)));

  btn.disabled = false;
  btn.textContent = "🔄 Refresh Briefing";

  const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  document.getElementById("lastRefresh").textContent = `Last refreshed: ${now}`;
}
0upload%20workflow%22git%20push%20origin%20maingithub/workflows/ci.yml.ci.yml%0Aactions/checkout@v3world.txt%20at%20path/to/artifact/%20with%20the%20content%20Hello%20World!.%0Aour%20full%20daily%20briefing%20covers:%0A%0A%F0%9F%93%88%20MARKETS:%20S&P%20500,%20Dow%20Jones,%20Nasdaq,%20Fed%20interest%20rate%0A%F0%9F%9B%A2%EF%B8%8F%20COMMODITIES:%20Gold,%20Silver,%20Oil,%20Grain%20prices%20+%20YoY%20comparison%0A%F0%9F%8C%BF%20CANNABIS:%20Wholesale%20pricing%20index%20(indoor/greenhouse/outdoor)%20from%20Cannabis%20Benchmarks%0A%F0%9F%8F%A0%20REAL%20ESTATE:%20California%20market,%20Burbank/Glendale/Studio%20City/Sherman%20Oaks/Pasadena%20trends%0A%F0%9F%8F%A2%20MULTIFAMILY:%20Turnkey%2015-50%20unit%20deals,%20cap%20rates,%20per-unit%20pricing,%20vacancy%202025%20vs%202026%0A%E2%9A%96%EF%B8%8F%20CA%20LAW%20&%20POLITICS:%20Landlord-tenant%20law%20updates,%20local%20ordinances%0A%F0%9F%94%90%20SECURITY%20CHECK:%20Daily%20privacy%20and%20device%20security%20review%0A%F0%9F%99%8F%20GRATITUDE:%20Name%203%20things%20you%20are%20grateful%20for%20today%0A%0AYou%20are%20building%20something%20real%20Frank%20-%20keep%20going!%20%F0%9F%92%AA%0Aactions/upload-artifact@v4%20action%20uploads%20world.txt%20as%20an%20artifact%20named%20my-artifact.jobs:
  upload:
    name:
https://youtu.be/EvclxVOY4r8?si=lYrvv2J3cv-u_zPL

 upload 

(frankpereira1-web/upload-artifact),

git clone https://github.com/frankpereira1-web/upload-artifact.git
cd upload-artifact
> [!WARNING]
> actions/upload-artifact@v3 is scheduled for deprecation on **November 30, 2024**. [Learn more.](https://github.blog/changelog/2024-04-16-deprecation-notice-v3-of-the-artifact-actions/)
> Similarly, v1/v2 are scheduled for deprecation on **June 30, 2024**.
> Please update your workflow to use v4 of the artifact actions.
> This deprecation will not impact any existing versions of GitHub Enterprise Server being used by customers.

Upload [Actions Artifacts](https://docs.github.com/en/actions/using-workflows/storing-workflow-data-as-artifacts) from your Workflow Runs. Internally powered by [@actions/artifact](https://github.com/actions/toolkit/tree/main/packages/artifact) package.

See also [download-artifact](https://github.com/actions/download-artifact).

- [`@actions/upload-artifact`](#actionsupload-artifact)
  - [v6 - What's new](#v6---whats-new)
  - [v4 - What's new](#v4---whats-new)
    - [Improvements](#improvements)
    - [Breaking Changes](#breaking-changes)
  - [Usage](#usage)
    - [Inputs](#inputs)
    - [Outputs](#outputs)
  - [Examples](#examples)
    - [Upload an Individual File](#upload-an-individual-file)
    - [Upload an Entire Directory](#upload-an-entire-directory)
    - [Upload using a Wildcard Pattern](#upload-using-a-wildcard-pattern)
    - [Upload using Multiple Paths and Exclusions](#upload-using-multiple-paths-and-exclusions)
    - [Altering compressions level (speed v. size)](#altering-compressions-level-speed-v-size)
    - [Customization if no files are found](#customization-if-no-files-are-found)
    - [(Not) Uploading to the same artifact](#not-uploading-to-the-same-artifact)
    - [Environment Variables and Tilde Expansion](#environment-variables-and-tilde-expansion)
    - [Retention Period](#retention-period)
    - [Using Outputs](#using-outputs)
      - [Example output between steps](#example-output-between-steps)
      - [Example output between jobs](#example-output-between-jobs)
    - [Overwriting an Artifact](#overwriting-an-artifact)
  - [Limitations](#limitations)
    - [Number of Artifacts](#number-of-artifacts)
    - [Zip archives](#zip-archives)
    - [Permission Loss](#permission-loss)
  - [Where does the upload go?](#where-does-the-upload-go)


## v6 - What's new

> [!IMPORTANT]
> actions/upload-artifact@v6 now runs on Node.js 24 (`runs.using: node24`) and requires a minimum Actions Runner version of 2.327.1. If you are using self-hosted runners, ensure they are updated before upgrading.

### Node.js 24

This release updates the runtime to Node.js 24. v5 had preliminary support for Node.js 24, however this action was by default still running on Node.js 20. Now this action by default will run on Node.js 24.

## v4 - What's new

> [!IMPORTANT]
> upload-artifact@v4+ is not currently supported on GitHub Enterprise Server (GHES) yet. If you are on GHES, you must use [v3](https://github.com/actions/upload-artifact/releases/tag/v3) (Node 16) or [v3-node20](https://github.com/actions/upload-artifact/releases/tag/v3-node20) (Node 20).

The release of upload-artifact@v4 and download-artifact@v4 are major changes to the backend architecture of Artifacts. They have numerous performance and behavioral improvements.

For more information, see the [`@actions/artifact`](https://github.com/actions/toolkit/tree/main/packages/artifact) documentation.

There is also a new sub-action, `actions/upload-artifact/merge`. For more info, check out that action's [README](./merge/README.md).

### Improvements

1. Uploads are significantly faster, upwards of 90% improvement in worst case scenarios.
2. Once uploaded, an Artifact ID is returned and Artifacts are immediately available in the UI and [REST API](https://docs.github.com/en/rest/actions/artifacts). Previously, you would have to wait for the run to be completed before an ID was available or any APIs could be utilized.
3. The contents of an Artifact are uploaded together into an _immutable_ archive. They cannot be altered by subsequent jobs unless the Artifacts are deleted and recreated (where they will have a new ID). Both of these factors help reduce the possibility of accidentally corrupting Artifact files.
4. The compression level of an Artifact can be manually tweaked for speed or size reduction.

### Breaking Changes

1. On self hosted runners, additional [firewall rules](https://github.com/actions/toolkit/tree/main/packages/artifact#breaking-changes) may be required.
2. Uploading to the same named Artifact multiple times.

    Due to how Artifacts are created in this new version, it is no longer possible to upload to the same named Artifact multiple times. You must either split the uploads into multiple Artifacts with different names, or only upload once. Otherwise you _will_ encounter an error.

3. Limit of Artifacts for an individual job. Each job in a workflow run now has a limit of 500 artifacts.
4. With `v4.4` and later, hidden files are excluded by default.

For assistance with breaking changes, see [MIGRATION.md](docs/MIGRATION.md).

## Note

Thank you for your interest in this GitHub repo, however, right now we are not taking contributions. 

We continue to focus our resources on strategic areas that help our customers be successful while making developers' lives easier. While GitHub Actions remains a key part of this vision, we are allocating resources towards other areas of Actions and are not taking contributions to this repository at this time. The GitHub public roadmap is the best place to follow along for any updates on features we’re working on and what stage they’re in.

We are taking the following steps to better direct requests related to GitHub Actions, including:

1. We will be directing questions and support requests to our [Community Discussions area](https://github.com/orgs/community/discussions/categories/actions)

2. High Priority bugs can be reported through Community Discussions or you can report these to our support team https://support.github.com/contact/bug-report.

3. Security Issues should be handled as per our [security.md](SECURITY.md).

We will still provide security updates for this project and fix major breaking changes during this time.

You are welcome to still raise bugs in this repo.

## Usage

### Inputs

```yaml
- uses: actions/upload-artifact@v4
  with:
    # Name of the artifact to upload.
    # Optional. Default is 'artifact'
    name:

    # A file, directory or wildcard pattern that describes what to upload
    # Required.
    path:

    # The desired behavior if no files are found using the provided path.
    # Available Options:
    #   warn: Output a warning but do not fail the action
    #   error: Fail the action with an error message
    #   ignore: Do not output any warnings or errors, the action does not fail
    # Optional. Default is 'warn'
    if-no-files-found:

    # Duration after which artifact will expire in days. 0 means using default retention.
    # Minimum 1 day.
    # Maximum 90 days unless changed from the repository settings page.
    # Optional. Defaults to repository settings.
    retention-days:

    # The level of compression for Zlib to be applied to the artifact archive.
    # The value can range from 0 to 9.
    # For large files that are not easily compressed, a value of 0 is recommended for significantly faster uploads.
    # Optional. Default is '6'
    compression-level:

    # If true, an artifact with a matching name will be deleted before a new one is uploaded.
    # If false, the action will fail if an artifact for the given name already exists.
    # Does not fail if the artifact does not exist.
    # Optional. Default is 'false'
    overwrite:

    # Whether to include hidden files in the provided path in the artifact
    # The file contents of any hidden files in the path should be validated before
    # enabled this to avoid uploading sensitive information.
    # Optional. Default is 'false'
    include-hidden-files:
```

### Outputs

| Name | Description | Example |
| - | - | - |
| `artifact-id` | GitHub ID of an Artifact, can be used by the REST API | `1234` |
| `artifact-url` | URL to download an Artifact. Can be used in many scenarios such as linking to artifacts in issues or pull requests. Users must be logged-in in order for this URL to work. This URL is valid as long as the artifact has not expired or the artifact, run or repository have not been deleted | `https://github.com/example-org/example-repo/actions/runs/1/artifacts/1234` |
| `artifact-digest` | SHA-256 digest of an Artifact | 0fde654d4c6e659b45783a725dc92f1bfb0baa6c2de64b34e814dc206ff4aaaf |

## Examples

### Upload an Individual File

```yaml
steps:
- run: mkdir -p path/to/artifact
- run: echo hello > path/to/artifact/world.txt
- uses: actions/upload-artifact@v4
  with:
    name: my-artifact
    path: path/to/artifact/world.txt
```

### Upload an Entire Directory

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: my-artifact
    path: path/to/artifact/ # or path/to/artifact
```

### Upload using a Wildcard Pattern

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: my-artifact
    path: path/**/[abc]rtifac?/*
```

### Upload using Multiple Paths and Exclusions

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: my-artifact
    path: |
      path/output/bin/
      path/output/test-results
      !path/**/*.tmp
```

For supported wildcards along with behavior and documentation, see [@actions/glob](https://github.com/actions/toolkit/tree/main/packages/glob) which is used internally to search for files.

If a wildcard pattern is used, the path hierarchy will be preserved after the first wildcard pattern:

```
path/to/*/directory/foo?.txt =>
    ∟ path/to/some/directory/foo1.txt
    ∟ path/to/some/directory/foo2.txt
    ∟ path/to/other/directory/foo1.txt

would be flattened and uploaded as =>
    ∟ some/directory/foo1.txt
    ∟ some/directory/foo2.txt
    ∟ other/directory/foo1.txt
```

If multiple paths are provided as input, the least common ancestor of all the search paths will be used as the root directory of the artifact. Exclude paths do not affect the directory structure.

Relative and absolute file paths are both allowed. Relative paths are rooted against the current working directory. Paths that begin with a wildcard character should be quoted to avoid being interpreted as YAML aliases.

### Altering compressions level (speed v. size)

If you are uploading large or easily compressable data to your artifact, you may benefit from tweaking the compression level. By default, the compression level is `6`, the same as GNU Gzip.

The value can range from 0 to 9:
  - 0: No compression
  - 1: Best speed
  - 6: Default compression (same as GNU Gzip)
  - 9: Best compression

Higher levels will result in better compression, but will take longer to complete.
For large files that are not easily compressed, a value of `0` is recommended for significantly faster uploads.

For instance, if you are uploading random binary data, you can save a lot of time by opting out of compression completely, since it won't benefit:

```yaml
- name: Make a 1GB random binary file
  run: |
    dd if=/dev/urandom of=my-1gb-file bs=1M count=1000
- uses: actions/upload-artifact@v4
  with:
    name: my-artifact
    path: my-1gb-file
    compression-level: 0 # no compression
```

But, if you are uploading data that is easily compressed (like plaintext, code, etc) you can save space and cost by having a higher compression level. But this will be heavier on the CPU therefore slower to upload:

```yaml
- name: Make a file with a lot of repeated text
  run: |
    for i in {1..100000}; do echo -n 'foobar' >> foobar.txt; done
- uses: actions/upload-artifact@v4
  with:
    name: my-artifact
    path: foobar.txt
    compression-level: 9 # maximum compression
```

### Customization if no files are found

If a path (or paths), result in no files being found for the artifact, the action will succeed but print out a warning. In certain scenarios it may be desirable to fail the action or suppress the warning. The `if-no-files-found` option allows you to customize the behavior of the action if no files are found:

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: my-artifact
    path: path/to/artifact/
    if-no-files-found: error # 'warn' or 'ignore' are also available, defaults to `warn`
```

### (Not) Uploading to the same artifact

Unlike earlier versions of `upload-artifact`, uploading to the same artifact via multiple jobs is _not_ supported with `v4`.

```yaml
- run: echo hi > world.txt
- uses: actions/upload-artifact@v4
  with:
    # implicitly named as 'artifact'
    path: world.txt

- run: echo howdy > extra-file.txt
- uses: actions/upload-artifact@v4
  with:
    # also implicitly named as 'artifact', will fail here!
    path: extra-file.txt
```

Artifact names must be unique since each created artifact is idempotent so multiple jobs cannot modify the same artifact.

In matrix scenarios, be careful to not accidentally upload to the same artifact, or else you will encounter conflict errors. It would be best to name the artifact _with_ a prefix or suffix from the matrix:

```yaml
jobs:
  upload:
    name: Generate Build Artifacts

    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
        version: [a, b, c]

    runs-on: ${{ matrix.os }}

    steps:
    - name: Build
      run: ./some-script --version=${{ matrix.version }} > my-binary
    - name: Upload
      uses: actions/upload-artifact@v4
      with:
        name: binary-${{ matrix.os }}-${{ matrix.version }}
        path: my-binary
```

This will result in artifacts like: `binary-ubuntu-latest-a`, `binary-windows-latest-b`, and so on.

Previously the behavior _allowed_ for the artifact names to be the same which resulted in unexpected mutations and accidental corruption. Artifacts created by upload-artifact@v4 are immutable.

### Environment Variables and Tilde Expansion

You can use `~` in the path input as a substitute for `$HOME`. Basic tilde expansion is supported:

```yaml
  - run: |
      mkdir -p ~/new/artifact
      echo hello > ~/new/artifact/world.txt
  - uses: actions/upload-artifact@v4
    with:
      name: my-artifacts
      path: ~/new/**/*
```

Environment variables along with context expressions can also be used for input. For documentation see [context and expression syntax](https://help.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions):

```yaml
    env:
      name: my-artifact
    steps:
    - run: |
        mkdir -p ${{ github.workspace }}/artifact
        echo hello > ${{ github.workspace }}/artifact/world.txt
    - uses: actions/upload-artifact@v4
      with:
        name: ${{ env.name }}-name
        path: ${{ github.workspace }}/artifact/**/*
```

For environment variables created in other steps, make sure to use the `env` expression syntax

```yaml
    steps:
    - run: |
        mkdir testing
        echo "This is a file to upload" > testing/file.txt
        echo "artifactPath=testing/file.txt" >> $GITHUB_ENV
    - uses: actions/upload-artifact@v4
      with:
        name: artifact
        path: ${{ env.artifactPath }} # this will resolve to testing/file.txt at runtime
```

### Retention Period

Artifacts are retained for 90 days by default. You can specify a shorter retention period using the `retention-days` input:

```yaml
  - name: Create a file
    run: echo "I won't live long" > my_file.txt

  - name: Upload Artifact
    uses: actions/upload-artifact@v4
    with:
      name: my-artifact
      path: my_file.txt
      retention-days: 5
```

The retention period must be between 1 and 90 inclusive. For more information see [artifact and log retention policies](https://docs.github.com/en/free-pro-team@latest/actions/reference/usage-limits-billing-and-administration#artifact-and-log-retention-policy).

### Using Outputs

If an artifact upload is successful then an `artifact-id` output is available. This ID is a unique identifier that can be used with [Artifact REST APIs](https://docs.github.com/en/rest/actions/artifacts).

#### Example output between steps

```yml
    - uses: actions/upload-artifact@v4
      id: artifact-upload-step
      with:
        name: my-artifact
        path: path/to/artifact/content/

    - name: Output artifact ID
      run:  echo 'Artifact ID is ${{ steps.artifact-upload-step.outputs.artifact-id }}'
```

#### Example output between jobs

```yml
jobs:
  job1:
    runs-on: ubuntu-latest
    outputs:
      output1: ${{ steps.artifact-upload-step.outputs.artifact-id }}
    steps:
      - uses: actions/upload-artifact@v4
        id: artifact-upload-step
        with:
          name: my-artifact
          path: path/to/artifact/content/
  job2:
    runs-on: ubuntu-latest
    needs: job1
    steps:
      - env:
          OUTPUT1: ${{needs.job1.outputs.output1}}
        run: echo "Artifact ID from previous job is $OUTPUT1"
```

### Overwriting an Artifact

Although it's not possible to mutate an Artifact, can completely overwrite one. But do note that this will give the Artifact a new ID, the previous one will no longer exist:

```yaml
jobs:
  upload:
    runs-on: ubuntu-latest
    steps:
      - name: Create a file
        run: echo "hello world" > my-file.txt
      - name: Upload Artifact
        uses: actions/upload-artifact@v4
        with:
          name: my-artifact # NOTE: same artifact name
          path: my-file.txt
  upload-again:
    needs: upload
    runs-on: ubuntu-latest
    steps:
      - name: Create a different file
        run: echo "goodbye world" > my-file.txt
      - name: Upload Artifact
        uses: actions/upload-artifact@v4
        with:
          name: my-artifact # NOTE: same artifact name
          path: my-file.txt
          overwrite: true
```

### Uploading Hidden Files

By default, hidden files are ignored by this action to avoid unintentionally uploading sensitive information.

If you need to upload hidden files, you can use the `include-hidden-files` input.
Any files that contain sensitive information that should not be in the uploaded artifact can be excluded
using the `path`:

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: my-artifact
    include-hidden-files: true
    path: |
      path/output/
      !path/output/.production.env
```

Hidden files are defined as any file beginning with `.` or files within folders beginning with `.`.
On Windows, files and directories with the hidden attribute are not considered hidden files unless
they have the `.` prefix.

## Limitations

### Number of Artifacts

Within an individual job, there is a limit of 500 artifacts that can be created for that job.

You may also be limited by Artifacts if you have exceeded your shared storage quota. Storage is calculated every 6-12 hours. See [the documentation](https://docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions#calculating-minute-and-storage-spending) for more info.

### Zip archives

When an Artifact is uploaded, all the files are assembled into an immutable Zip archive. There is currently no way to download artifacts in a format other than a Zip or to download individual artifact contents.

### Permission Loss

File permissions are not maintained during artifact upload. All directories will have `755` and all files will have `644`. For example, if you make a file executable using `chmod` and then upload that file, post-download the file is no longer guaranteed to be set as an executable.

If you must preserve permissions, you can `tar` all of your files together before artifact upload. Post download, the `tar` file will maintain file permissions and case sensitivity.

```yaml
- name: 'Tar files'
  run: tar -cvf my_files.tar /path/to/my/directory

- name: 'Upload Artifact'
  uses: actions/upload-artifact@v4
  with:
    name: my-artifact
    path: my_files.tar
```

## Where does the upload go?

At the bottom of the workflow summary page, there is a dedicated section for artifacts. Here's a screenshot of something you might see:

<img src="https://github.com/user-attachments/assets/bcb7120f-f445-4a3e-9596-77f85f7e0af0" width="700" height="300">


There is a trashcan icon that can be used to delete the artifact. This icon will only appear for users who have write permissions to the repository.

The size of the artifact is denoted in bytes. The displayed artifact size denotes the size of the zip that `upload-artifact` creates during upload. The Digest column will display the SHA256 digest of the artifact being uploaded.
