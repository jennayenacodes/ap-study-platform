const topThreeContainer = document.getElementById('top-three');
const addTopThreeBtn = document.getElementById('add-top-three');
const generateBtn = document.getElementById('generate');
const copyBtn = document.getElementById('copy');
const saveBtn = document.getElementById('save');
const savedMsg = document.getElementById('saved-msg');

const coinsEl = document.getElementById('coins');
const petStatusEl = document.getElementById('pet-status');
const chatBox = document.getElementById('chat-box');
const bunnyEl = document.getElementById('bunny');
const bedEl = document.getElementById('bed');
const lampEl = document.getElementById('lamp');
const tubEl = document.getElementById('tub');
const carrotFxEl = document.getElementById('carrot-fx');
const bubbleFxEl = document.getElementById('bubble-fx');
const heartFxEl = document.getElementById('heart-fx');

const outfitLineEl = document.getElementById('outfit-line');
const outfitLinkEl = document.getElementById('outfit-link');
const bodyPositiveEl = document.getElementById('body-positive');

let state = {
  priorities: ['', '', ''],
  classes: '',
  energy: 'Medium 🙂',
  mood: '',
  task: '',
  minutes: 60,
  coins: 0,
  hasBed: false,
  hasLamp: false,
  chat: [],
  outfitPick: '',
};

const bodyPositivityLines = [
  'Your body is not a problem to solve — it is a home to honor. You deserve to feel confident and kind to yourself today. 💖',
  'Style is about joy, not shrinking yourself. You are beautifully made and already enough. 🌷',
  'Wear what makes you feel strong, comfy, and bright. Confidence looks amazing on you. ✨',
  'You don\'t need to change your body to deserve a great outfit day. You are worthy right now. 🌸',
];

function addPriorityRow(value = '') {
  if (topThreeContainer.children.length >= 3) return;
  const wrapper = document.createElement('div');
  wrapper.className = 'priority-item';

  const index = document.createElement('span');
  index.textContent = `${topThreeContainer.children.length + 1}.`;

  const input = document.createElement('input');
  input.placeholder = 'Describe a key win for today';
  input.value = value;

  wrapper.append(index, input);
  topThreeContainer.append(wrapper);

  if (topThreeContainer.children.length >= 3) {
    addTopThreeBtn.disabled = true;
  }
}

function getPriorities() {
  return [...document.querySelectorAll('.priority-item input')].map((item) => item.value.trim());
}

function setAnimation(mode = 'idle') {
  bunnyEl.classList.remove('idle', 'eating', 'washing', 'cheer');
  bunnyEl.classList.add(mode);
}

function showFx(fxEl, time = 900) {
  fxEl.classList.add('show');
  window.setTimeout(() => fxEl.classList.remove('show'), time);
}

function refreshFurniture() {
  bedEl.classList.toggle('show', state.hasBed);
  lampEl.classList.toggle('show', state.hasLamp);
}

function refreshPetUI(message = 'Hopey believes in you! 🌸') {
  coinsEl.textContent = state.coins;
  petStatusEl.textContent = message;
  refreshFurniture();
}

function addCoins(amount, message) {
  state.coins += amount;
  refreshPetUI(message);
}

function spendCoins(cost) {
  if (state.coins < cost) {
    refreshPetUI('Not enough carrots yet—keep using your AI tools! 🥕');
    return false;
  }
  state.coins -= cost;
  return true;
}

function encourageByPetTap() {
  const lines = [
    'Hopey says: one small step still counts. 💕',
    'Hopey says: God is with you in every study block. 🌼',
    'Hopey says: progress > perfection. Keep going!',
    'Hopey says: you\'re growing every day, even when it feels slow. 🌟',
  ];
  const line = lines[Math.floor(Math.random() * lines.length)];
  setAnimation('cheer');
  showFx(heartFxEl, 1000);
  refreshPetUI(line);
}

function generatePrompt() {
  state.priorities = getPriorities();

  const prioritiesText = state.priorities
    .filter(Boolean)
    .map((priority, index) => `${index + 1}) ${priority}`)
    .join('\n') || 'None entered';

  const prompt = `You are my supportive student coach. I am a high school senior balancing AP classes and rehearsals.

Create a clear ${document.getElementById('minutes').value}-minute plan for today.

Context:
- Top 3 priorities:
${prioritiesText}
- Schedule commitments:
${document.getElementById('classes').value || 'Not provided'}
- Energy level: ${document.getElementById('energy').value}
- Mood: ${document.getElementById('mood').value || 'Not provided'}
- Current task: ${document.getElementById('task').value || 'Not provided'}

Requirements:
1) Provide exact focus blocks with minute ranges.
2) Include one AP study tactic and one rehearsal/performance tactic.
3) Include a low-energy backup version of the plan.
4) End with a 5-minute reflection checklist.
5) Keep tone encouraging and practical.`;

  document.getElementById('prompt-output').value = prompt;
  addCoins(2, 'Great job building your prompt! Hopey does a happy hop! 🐰');
  setAnimation('cheer');
}

function bunnyReply(userText) {
  const text = userText.toLowerCase();

  if (text.includes('stressed') || text.includes('anxious') || text.includes('nervous')) {
    return 'You are not alone. “Cast all your anxiety on Him because He cares for you.” (1 Peter 5:7) Let’s take one faithful step at a time. 💛';
  }

  if (text.includes('tired') || text.includes('exhausted')) {
    return 'Rest matters. “Come to me... and I will give you rest.” (Matthew 11:28) Let’s make a smaller plan and keep moving gently. 🌿';
  }

  if (text.includes('fail') || text.includes('behind')) {
    return 'Progress, not perfection. “I can do all things through Christ who strengthens me.” (Philippians 4:13) You can still finish strong. ✨';
  }

  return 'I’m cheering for you! “Be strong and courageous... for the Lord your God will be with you.” (Joshua 1:9) What’s your next tiny win today? 🐰';
}

function renderChat() {
  chatBox.innerHTML = '';
  state.chat.forEach((entry) => {
    const line = document.createElement('div');
    line.className = `chat-msg ${entry.role}`;
    line.textContent = entry.text;
    chatBox.appendChild(line);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

function sendChat() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  state.chat.push({ role: 'user', text: `You: ${text}` });
  state.chat.push({ role: 'bot', text: `Hopey: ${bunnyReply(text)}` });
  renderChat();
  input.value = '';
}

function uniquePins(pinUrls) {
  return [...new Set(pinUrls.filter((url) => /pinterest\.com\/pin\//i.test(url)))];
}

function parsePinLinksFromText(text) {
  const matches = text.match(/https?:\/\/[^\s]+/g) || [];
  return uniquePins(matches);
}

async function fetchPinsFromBoard(boardUrl) {
  const cleanBoardUrl = boardUrl.trim();
  if (!cleanBoardUrl) return [];

  try {
    const response = await fetch(`https://r.jina.ai/http://${cleanBoardUrl.replace(/^https?:\/\//, '')}`);
    if (!response.ok) return [];

    const body = await response.text();
    const urls = body.match(/https?:\/\/www\.pinterest\.com\/pin\/[0-9]+\/?/g) || [];
    return uniquePins(urls);
  } catch (_error) {
    return [];
  }
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

async function pickOutfitFromPinterest() {
  const boardUrl = document.getElementById('board-url').value;
  const manualPins = parsePinLinksFromText(document.getElementById('pin-links').value);

  outfitLineEl.textContent = 'Picking your outfit inspiration...';
  outfitLinkEl.textContent = '';
  outfitLinkEl.removeAttribute('href');

  const fetchedPins = await fetchPinsFromBoard(boardUrl);
  const allPins = uniquePins([...fetchedPins, ...manualPins]);

  if (!allPins.length) {
    outfitLineEl.textContent = 'I could not load pins from that board right now. Try pasting a few pin URLs as fallback.';
    bodyPositiveEl.textContent = randomItem(bodyPositivityLines);
    return;
  }

  const pick = randomItem(allPins);
  state.outfitPick = pick;

  outfitLineEl.textContent = 'Today\'s random Pinterest outfit pick:';
  outfitLinkEl.href = pick;
  outfitLinkEl.textContent = pick;
  bodyPositiveEl.textContent = randomItem(bodyPositivityLines);

  addCoins(2, 'Outfit picked! Hopey loves your style energy ✨');
  setAnimation('cheer');
  showFx(heartFxEl, 900);
}

function gatherData() {
  return {
    priorities: getPriorities(),
    classes: document.getElementById('classes').value,
    energy: document.getElementById('energy').value,
    mood: document.getElementById('mood').value,
    task: document.getElementById('task').value,
    minutes: document.getElementById('minutes').value,
    coins: state.coins,
    hasBed: state.hasBed,
    hasLamp: state.hasLamp,
    chat: state.chat,
    outfitPick: state.outfitPick,
  };
}

function loadData() {
  const raw = localStorage.getItem('bunnyBloom');

  if (!raw) {
    addPriorityRow();
    addPriorityRow();
    addPriorityRow();
    state.chat = [{ role: 'bot', text: 'Hopey: Hi friend! I’m praying you have a peaceful, productive day. 🌸' }];
    renderChat();
    refreshPetUI();
    setAnimation('idle');
    return;
  }

  const data = JSON.parse(raw);
  state = { ...state, ...data };

  (state.priorities || []).forEach((priority) => addPriorityRow(priority));
  while (topThreeContainer.children.length < 3) addPriorityRow();

  document.getElementById('classes').value = state.classes || '';
  document.getElementById('energy').value = state.energy || 'Medium 🙂';
  document.getElementById('mood').value = state.mood || '';
  document.getElementById('task').value = state.task || '';
  document.getElementById('minutes').value = state.minutes || 60;

  if (state.outfitPick) {
    outfitLineEl.textContent = 'Last saved outfit pick:';
    outfitLinkEl.href = state.outfitPick;
    outfitLinkEl.textContent = state.outfitPick;
  }

  renderChat();
  refreshPetUI('Welcome back! Hopey missed you 💗');
  setAnimation('idle');
}

addTopThreeBtn.addEventListener('click', () => addPriorityRow());
generateBtn.addEventListener('click', generatePrompt);

document.getElementById('feed').addEventListener('click', () => {
  if (!spendCoins(1)) return;
  setAnimation('eating');
  showFx(carrotFxEl);
  refreshPetUI('Hopey munches a tiny snack: 🥕 nom nom!');
});

document.getElementById('shower').addEventListener('click', () => {
  if (!spendCoins(1)) return;
  setAnimation('washing');
  tubEl.classList.add('show');
  showFx(bubbleFxEl, 1200);
  refreshPetUI('Bubble shower time! Hopey smells like strawberries 🫧');
  window.setTimeout(() => tubEl.classList.remove('show'), 1300);
});

document.getElementById('buy-bed').addEventListener('click', () => {
  if (state.hasBed) {
    refreshPetUI('You already bought the cozy cloud bed! ☁️');
    return;
  }
  if (!spendCoins(3)) return;
  state.hasBed = true;
  refreshFurniture();
  refreshPetUI('New furniture unlocked: cloud bed!');
  showFx(heartFxEl, 900);
});

document.getElementById('buy-lamp').addEventListener('click', () => {
  if (state.hasLamp) {
    refreshPetUI('The star lamp is already glowing! ⭐');
    return;
  }
  if (!spendCoins(4)) return;
  state.hasLamp = true;
  refreshFurniture();
  refreshPetUI('New furniture unlocked: star lamp!');
  showFx(heartFxEl, 900);
});

copyBtn.addEventListener('click', async () => {
  const output = document.getElementById('prompt-output').value;
  if (!output) return;
  await navigator.clipboard.writeText(output);
  addCoins(1, 'Prompt copied! Hopey gives you bonus carrots 🥕');
  savedMsg.textContent = 'Copied!';
});

document.getElementById('pick-outfit').addEventListener('click', pickOutfitFromPinterest);

bunnyEl.addEventListener('click', encourageByPetTap);

document.getElementById('send-chat').addEventListener('click', sendChat);
document.getElementById('chat-input').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') sendChat();
});

saveBtn.addEventListener('click', () => {
  localStorage.setItem('bunnyBloom', JSON.stringify(gatherData()));
  savedMsg.textContent = 'Saved! You and Hopey are building momentum 💕';
});

loadData();
