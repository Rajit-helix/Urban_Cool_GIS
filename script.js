/* ===============================
   DATA CONFIGURATION
   =============================== */
const CITIES = {
    Bhubaneswar: [20.2961, 85.8245],
    Delhi: [28.6139, 77.2090],
    Mumbai: [19.0760, 72.8777]
};

// Expanded Mock Data
const HOTSPOTS_DATA = [
    // Bhubaneswar
    { lat: 20.2961, lng: 85.8245, temp: 42, veg: 10, risk: "High", pop: 12000, city: "Bhubaneswar", area: "Rasulgarh" },
    { lat: 20.305, lng: 85.83, temp: 38, veg: 25, risk: "Moderate", pop: 8500, city: "Bhubaneswar", area: "Saheed Nagar" },
    { lat: 20.29, lng: 85.81, temp: 45, veg: 5, risk: "Critical", pop: 15000, city: "Bhubaneswar", area: "Old Town" },
    { lat: 20.315, lng: 85.84, temp: 40, veg: 15, risk: "High", pop: 11000, city: "Bhubaneswar", area: "Patia" },
    { lat: 20.27, lng: 85.84, temp: 36, veg: 35, risk: "Low", pop: 6000, city: "Bhubaneswar", area: "Khandagiri" },

    // Delhi
    { lat: 28.6139, lng: 77.2090, temp: 44, veg: 8, risk: "High", pop: 22000, city: "Delhi", area: "Connaught Place" },
    { lat: 28.6506, lng: 77.2306, temp: 46, veg: 4, risk: "Critical", pop: 35000, city: "Delhi", area: "Chandni Chowk" },
    { lat: 28.5355, lng: 77.3910, temp: 41, veg: 12, risk: "High", pop: 18000, city: "Delhi", area: "Noida Sec 18" },
    { lat: 28.5921, lng: 77.0460, temp: 39, veg: 20, risk: "Moderate", pop: 14000, city: "Delhi", area: "Dwarka" },
    { lat: 28.5244, lng: 77.1855, temp: 37, veg: 30, risk: "Moderate", pop: 12000, city: "Delhi", area: "Hauz Khas" },

    // Mumbai
    { lat: 19.0760, lng: 72.8777, temp: 35, veg: 30, risk: "Low", pop: 18000, city: "Mumbai", area: "Bandra" },
    { lat: 19.0330, lng: 72.8470, temp: 33, veg: 40, risk: "Low", pop: 15000, city: "Mumbai", area: "Colaba" },
    { lat: 19.1136, lng: 72.8697, temp: 38, veg: 15, risk: "Moderate", pop: 25000, city: "Mumbai", area: "Andheri East" },
    { lat: 19.0596, lng: 72.8295, temp: 34, veg: 35, risk: "Low", pop: 20000, city: "Mumbai", area: "Bandra West" },
    { lat: 19.1726, lng: 72.9425, temp: 40, veg: 10, risk: "High", pop: 28000, city: "Mumbai", area: "Mulund" }
];

const EV_STATIONS = [
    // Bhubaneswar
    { lat: 20.30, lng: 85.82, name: "EV Point Rasulgarh", city: "Bhubaneswar" },
    { lat: 20.32, lng: 85.81, name: "Patia Green Charge", city: "Bhubaneswar" },
    { lat: 20.26, lng: 85.84, name: "Airport EV Hub", city: "Bhubaneswar" },

    // Delhi
    { lat: 28.62, lng: 77.21, name: "CP SuperCharge", city: "Delhi" },
    { lat: 28.55, lng: 77.25, name: "Nehru Place EV", city: "Delhi" },
    { lat: 28.66, lng: 77.22, name: "Old Delhi Station Point", city: "Delhi" },

    // Mumbai
    { lat: 19.08, lng: 72.88, name: "BKC Fast Charge", city: "Mumbai" },
    { lat: 19.04, lng: 72.82, name: "Marine Drive EV", city: "Mumbai" },
    { lat: 19.12, lng: 72.85, name: "Andheri Metro EV", city: "Mumbai" }
];

/* ===============================
   Icons
   =============================== */
const evIcon = L.divIcon({
    html: '<div style="background-color: #3b82f6; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">⚡</div>',
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

/* ===============================
   STATE MANAGEMENT
   =============================== */
let currentCity = "Bhubaneswar";
let layers = {
    heat: true,
    veg: false,
    ev: false,
    pop: false
};
let thresholds = {
    temp: 0, // min temp
    veg: 0   // min veg %
};

/* ===============================
   MAP INITIALIZATION
   =============================== */
const map = L.map("map").setView(CITIES[currentCity], 12);

// Base Maps
const darkMap = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    { attribution: "&copy; OpenStreetMap contributors" }
);
const lightMap = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    { attribution: "&copy; OpenStreetMap contributors" }
);
const satelliteMap = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { attribution: "Tiles &copy; Esri" }
);

darkMap.addTo(map);

const baseMaps = {
    "🌙 Dark Mode": darkMap,
    "☀️ Light Mode": lightMap,
    "🛰️ Satellite View": satelliteMap
};

L.control.layers(baseMaps).addTo(map);

/* ===============================
   SEARCH BAR (GEOCODER)
   =============================== */
const geocoder = L.Control.geocoder({
    defaultMarkGeocode: false,
    placeholder: "Search for cities, places...",
    collapsed: false, // IMPORTANT: Keeps it open like a real search bar
    suggestMinLength: 1, // Trigger search after 1 character
    suggestTimeout: 250, // fast response (default is usually higher)
    queryMinLength: 1    // Ensure queries run for short strings
})
    .on('markgeocode', function (e) {
        const bbox = e.geocode.bbox;
        const poly = L.polygon([
            bbox.getSouthEast(),
            bbox.getNorthEast(),
            bbox.getNorthWest(),
            bbox.getSouthWest()
        ]);
        map.fitBounds(poly.getBounds());

        const center = poly.getBounds().getCenter();
        const newCityName = e.geocode.name.split(",")[0]; // Simple extraction

        // Check if we already have data
        let existingCity = Object.keys(CITIES).find(c => c.toLowerCase() === newCityName.toLowerCase());

        if (existingCity) {
            currentCity = existingCity;
            document.getElementById('city-select').value = existingCity; // Sync dropdown
        } else {
            // GENERATE DYNAMIC DATA
            currentCity = newCityName;
            CITIES[newCityName] = [center.lat, center.lng]; // Add to known cities

            // Add to Dropdown
            const select = document.getElementById('city-select');
            const option = document.createElement('option');
            option.value = newCityName;
            option.innerText = newCityName;
            select.appendChild(option);
            select.value = newCityName;

            // Show Toast/Notification (Optional but good for UX)
            // alert(`Simulating data for ${newCityName}...`); 

            generateMockData(newCityName, center.lat, center.lng);
        }

        renderLayers();
        updateFooterStats();

        // UPDATE LANGUAGE BASED ON NEW LOCATION
        updateLanguageByLocation(center.lat, center.lng);
    })
    .addTo(map);

// MOVE SEARCH BAR TO HEADER
document.getElementById('search-container').appendChild(geocoder.getContainer());

function generateMockData(cityName, lat, lng) {
    // 1. Generate Hotspots
    for (let i = 0; i < 5; i++) {
        HOTSPOTS_DATA.push({
            lat: lat + (Math.random() - 0.5) * 0.05,
            lng: lng + (Math.random() - 0.5) * 0.05,
            temp: Math.floor(Math.random() * (48 - 35) + 35),
            veg: Math.floor(Math.random() * 40),
            risk: Math.random() > 0.5 ? "High" : "Moderate",
            pop: Math.floor(Math.random() * 20000 + 5000),
            city: cityName,
            area: `${cityName} Zone ${i + 1}`
        });
    }

    // 2. Generate EV Stations
    for (let i = 0; i < 3; i++) {
        EV_STATIONS.push({
            lat: lat + (Math.random() - 0.5) * 0.04,
            lng: lng + (Math.random() - 0.5) * 0.04,
            name: `${cityName} EV Point ${i + 1}`,
            city: cityName
        });
    }

    // 3. Update Status
    const coolingText = document.querySelector('.cooling');
    coolingText.innerHTML = `Generated model for <strong>${cityName}</strong>`;
}

function updateFooterStats() {
    const cityHotspots = HOTSPOTS_DATA.filter(p => p.city === currentCity);
    const avgTemp = cityHotspots.reduce((acc, curr) => acc + curr.temp, 0) / (cityHotspots.length || 1);

    const footer = document.querySelector('.footer');
    footer.innerHTML = `
        <p>Total Hotspots: ${cityHotspots.length}</p>
        <p>Avg Temp: ${avgTemp.toFixed(1)}°C</p>
        <p>CO₂ Reduced: ${Math.floor(Math.random() * 20 + 10)}%</p>
    `;
}


/* ===============================
   LAYER GROUPS
   =============================== */
const heatLayerGroup = L.layerGroup().addTo(map);
const vegLayerGroup = L.layerGroup();
const evLayerGroup = L.layerGroup();

/* ===============================
   RENDER FUNCTIONS
   =============================== */
function renderLayers() {
    heatLayerGroup.clearLayers();
    vegLayerGroup.clearLayers();
    evLayerGroup.clearLayers();

    const cityCenter = CITIES[currentCity];

    // Render Heat & Veg Layers
    HOTSPOTS_DATA.forEach(point => {
        // Filter by City
        if (point.city !== currentCity) return;

        // Filter by Thresholds
        if (point.temp < thresholds.temp) return;
        if (point.veg < thresholds.veg) return;

        // Heat Circle
        if (layers.heat) {
            const circle = L.circle([point.lat, point.lng], {
                radius: 800,
                color: getColor(point.temp),
                fillColor: getColor(point.temp),
                fillOpacity: 0.6,
                className: 'animated-circle'
            }).bindTooltip(`${point.area || 'Zone'}: ${point.temp}°C`, { direction: 'top' })
                .on('click', () => updateRightPanel(point));
            heatLayerGroup.addLayer(circle);
        }

        // Vegetation Overlay (Green)
        if (layers.veg) {
            if (point.veg > 15) { // Only show significant green cover
                L.circle([point.lat, point.lng], {
                    radius: point.veg * 30, // Dynamic radius based on vegetation data (mock)
                    color: "transparent",
                    fillColor: "#22c55e",
                    fillOpacity: 0.4
                }).bindTooltip(`Vegetation: ${point.veg}%`, { direction: 'center', permanent: false })
                    .addTo(vegLayerGroup);
            }
        }
    });

    // Render EV Stations
    EV_STATIONS.forEach(station => {
        if (station.city !== currentCity) return;
        if (layers.ev) {
            L.marker([station.lat, station.lng], { icon: evIcon })
                .bindPopup(`<b>${station.name}</b><br>Status: Available<br>Chargers: 4/4`)
                .addTo(evLayerGroup);
        }
    });

    updateFooterStats();
}

function getColor(temp) {
    return temp > 40 ? '#ef4444' : // Red
        temp > 35 ? '#f97316' : // Orange
            '#eab308';              // Yellow
}

function updateRightPanel(data) {
    const panel = document.querySelector('.right-panel');
    const actionsList = document.getElementById('suggested-actions');

    // Simple animation
    panel.style.opacity = '0.5';

    setTimeout(() => {
        panel.style.opacity = '1';
        document.getElementById('details-risk').innerText = data.risk;
        document.getElementById('details-temp').innerText = `${data.temp}°C`;
        document.getElementById('details-pop').innerText = data.pop.toLocaleString();

        const expectedCoolingValue = (data.temp * 0.08).toFixed(1);
        document.getElementById('details-cooling').innerHTML = `Expected Cooling: <strong>↓ ${expectedCoolingValue}°C</strong>`;

        // DYNAMIC ACTIONS LOGIC
        let actions = [];

        // Temperature-based suggestions
        if (data.temp > 43) {
            actions.push("Cooling Shelters & Mist Fans");
            actions.push("High-Albedo Pavement Coating");
        } else if (data.temp > 39) {
            actions.push("Reflective Roofing (Cool Roofs)");
            actions.push("Increased Urban Shading");
        } else {
            actions.push("Public Water Fountains");
        }

        // Vegetation-based suggestions
        if (data.veg < 10) {
            actions.push("Intensive Tree Canopy Planting");
            actions.push("Vertical Green Walls");
        } else if (data.veg < 25) {
            actions.push("Pocket Park Development");
            actions.push("Permeable Grass Pavers");
        } else {
            actions.push("Canopy Maintenance & Protection");
            actions.push("Native Biodiversity Corridors");
        }

        // Cooling-based dynamic logic
        if (expectedCoolingValue > 3.5) {
            actions.push("High-Impact: District Cooling Expansion");
        } else if (expectedCoolingValue > 2.8) {
            actions.push("Moderate-Impact: Shaded Pedestrian Paths");
        } else {
            actions.push("Low-Impact: Supplemental Evaporative Cooling");
        }

        // Clear and populate actions list
        actionsList.innerHTML = "";
        // Show up to 5 recommendations
        actions.slice(0, 5).forEach(action => {
            const li = document.createElement('li');
            li.innerText = action;
            actionsList.appendChild(li);
        });

    }, 150);
}

/* ===============================
   EVENT LISTENERS
   =============================== */

// 1. City Selection
const citySelect = document.getElementById('city-select');
citySelect.addEventListener('change', (e) => {
    currentCity = e.target.value;
    const coords = CITIES[currentCity];
    map.flyTo(coords, 12, { duration: 2 });
    renderLayers();

    // UPDATE LANGUAGE BASED ON NEW LOCATION
    updateLanguageByLocation(coords[0], coords[1]);
});

// 2. Layer Toggles
document.getElementById('layer-heat').addEventListener('change', (e) => {
    layers.heat = e.target.checked;
    if (layers.heat) map.addLayer(heatLayerGroup);
    else map.removeLayer(heatLayerGroup);
    renderLayers();
});

document.getElementById('layer-veg').addEventListener('change', (e) => {
    layers.veg = e.target.checked;
    if (layers.veg) map.addLayer(vegLayerGroup);
    else map.removeLayer(vegLayerGroup);
    renderLayers();
});

document.getElementById('layer-ev').addEventListener('change', (e) => {
    layers.ev = e.target.checked;
    if (layers.ev) map.addLayer(evLayerGroup);
    else map.removeLayer(evLayerGroup);
    renderLayers();
});

// 3. Threshold Sliders
const tempSlider = document.getElementById('temp-slider');
const tempValue = document.getElementById('temp-value');
tempSlider.addEventListener('input', (e) => {
    thresholds.temp = e.target.value;
    tempValue.innerText = `${e.target.value}°C`;
    renderLayers();
});

const vegSlider = document.getElementById('veg-slider');
const vegValue = document.getElementById('veg-value');
vegSlider.addEventListener('input', (e) => {
    thresholds.veg = e.target.value;
    vegValue.innerText = `${e.target.value}%`;
    renderLayers();
});

// 4. Simulate Intervention
document.querySelector('.simulate-btn').addEventListener('click', () => {
    // Visual Hack: Turn all red circles to green for demonstration
    heatLayerGroup.eachLayer(layer => {
        layer.setStyle({
            color: '#22c55e',
            fillColor: '#4ade80'
        });
    });

    // Animate stats
    const coolingText = document.querySelector('.cooling');
    coolingText.innerHTML = "Simulating...";
    setTimeout(() => {
        coolingText.innerHTML = "Expected Cooling: <strong>↓ 5.2°C</strong> (Optimized)";
        coolingText.style.color = "#22d3ee"; // Cyan
    }, 1000);
});

// Region-to-Language Mapping
const REGION_LANGS = {
    "Odisha": { code: "od", name: "ଓଡ଼ିଆ (Odia)" },
    "Delhi": { code: "hi", name: "हिन्दी (Hindi)" },
    "Maharashtra": { code: "hi", name: "हिन्दी (Hindi)" },
    "West Bengal": { code: "bn", name: "বাংলা (Bengali)", welcome: "নমস্কার! আমি আপনার AI নগর সহকারী। আমি আপনাকে কীভাবে সাহায্য করতে পারি?" },
    "Karnataka": { code: "kn", name: "ಕನ್ನಡ (Kannada)", welcome: "ನಮಸ್ಕಾರ! ನಿಮ್ಮ AI ಅರ್ಬನ್ ಅಸಿಸ್ಟೆಂಟ್. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?" },
    "Tamil Nadu": { code: "ta", name: "தமிழ் (Tamil)", welcome: "வணக்கம்! உங்கள் AI நகர்ப்புற உதவியாளர். நான் உங்களுக்கு எப்படி உதவ முடியும்?" },
    "Spain": { code: "es", name: "Español", welcome: "¡Hola! Soy tu asistente urbano AI. ¿Cómo puedo ayudarte hoy?" }
};

async function updateLanguageByLocation(lat, lng) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        const address = data.address;
        const state = address.state || address.region;
        const country = address.country;

        console.log(`Detected Location: ${state}, ${country}`);
        const suggested = REGION_LANGS[state] || REGION_LANGS[country];

        if (suggested) {
            if (![...langSelect.options].some(opt => opt.value === suggested.code)) {
                const opt = document.createElement('option');
                opt.value = suggested.code;
                opt.innerText = `📍 ${suggested.name}`;
                langSelect.appendChild(opt);

                // Add to bot responses if it has a custom welcome
                if (suggested.welcome && !BOT_RESPONSES[suggested.code]) {
                    BOT_RESPONSES[suggested.code] = {
                        welcome: suggested.welcome,
                        fallback: "I'm still learning this language, but I'm here to help!"
                    };
                }

                langSelect.value = suggested.code;
                currentLang = suggested.code;
                chatMessages.innerHTML = "";
                addBotMessage(BOT_RESPONSES[currentLang]?.welcome || `Namaste! Detected region: ${state}`);
            }
        }
    } catch (e) { console.warn("Regional language detection failed."); }
}

window.addEventListener('DOMContentLoaded', () => {
    // 1. Browser Lang Detect
    const browserLang = (navigator.language || navigator.userLanguage).split('-')[0];
    if (BOT_RESPONSES[browserLang]) {
        currentLang = browserLang;
        langSelect.value = browserLang;
    } else if (browserLang === 'or') { currentLang = 'od'; langSelect.value = 'od'; }

    chatMessages.innerHTML = "";
    addBotMessage(BOT_RESPONSES[currentLang]?.welcome || BOT_RESPONSES.en.welcome);

    // 2. Geolocation + Regional Suggestions
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                CITIES["Your Location"] = [latitude, longitude];
                currentCity = "Your Location";

                const select = document.getElementById('city-select');
                if (![...select.options].some(o => o.value === "Your Location")) {
                    const opt = document.createElement('option');
                    opt.value = "Your Location";
                    opt.innerText = "📍 My Location";
                    select.prepend(opt);
                    select.value = "Your Location";
                }

                map.setView([latitude, longitude], 13);
                generateMockData("Your Location", latitude, longitude);
                renderLayers();
                updateLanguageByLocation(latitude, longitude);
            },
            () => renderLayers()
        );
    } else { renderLayers(); }
});

/* ===============================
   AI CHATBOT LOGIC (Multilingual)
   =============================== */
const chatbot = document.getElementById('ai-chatbot');
const chatToggle = document.getElementById('chatbot-toggle');
const closeChat = document.getElementById('close-chat');
const chatInput = document.getElementById('chat-input');
const sendChat = document.getElementById('send-chat');
const chatMessages = document.getElementById('chatbot-messages');
const langSelect = document.getElementById('lang-select');

const BOT_RESPONSES = {
    en: {
        welcome: "Hello! I'm your AI Urban Assistant. Ask me anything about heat mitigation or EV stations.",
        loading: "Thinking...",
        fallback: "I recommend focused tree plantation in hotspots to reduce temperatures by up to 3°C.",
        keywords: {
            heat: "Urban heat islands can be mitigated using cool roofs and pavement.",
            ev: "There are several EV stations near you. Check the blue icons on the map.",
            tree: "Planting native trees is the most effective way to provide natural shade."
        }
    },
    hi: {
        welcome: "नमस्ते! मैं आपका AI अर्बन असिस्टेंट हूँ। गर्मी कम करने या EV स्टेशनों के बारे में कुछ भी पूछें।",
        loading: "सोच रहा हूँ...",
        fallback: "मैं तापमान कम करने के लिए हॉटस्पॉट में पेड़ लगाने की सलाह देता हूँ।",
        keywords: {
            heat: "कूल रूफ और पेवमेंट का उपयोग करके शहरी गर्मी को कम किया जा सकता है।",
            ev: "आपके पास कई EV स्टेशन हैं। मानचित्र पर नीले आइकन देखें।",
            tree: "प्राकृतिक छाया प्रदान करने के लिए देशी पेड़ लगाना सबसे प्रभावी तरीका है।"
        }
    },
    od: {
        welcome: "ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କର AI ଅର୍ବାନ ଆସିଷ୍ଟାଣ୍ଟ। ଗରମ କମାଇବା କିମ୍ବା EV ଷ୍ଟେସନ ବିଷୟରେ କିଛି ବି ପଚାରନ୍ତୁ।",
        loading: "ଭାବୁଛି...",
        fallback: "ତାପମାତ୍ରା କମାଇବା ପାଇଁ ମୁଁ ହଟସପଟରେ ଗଛ ଲଗାଇବାକୁ ପରାମର୍ଶ ଦେଉଛି।",
        keywords: {
            heat: "କୁଲ୍ ରୁଫ୍ ବ୍ୟବହାର କରି ସହରର ଗରମ କମାଯାଇପାରିବ।",
            ev: "ଆପଣଙ୍କ ପାଖରେ ଅନେକ EV ଷ୍ଟେସନ ଅଛି। ମ୍ୟାପରେ ନିଳ ଆଇକନ ଦେଖନ୍ତୁ।",
            tree: "ପ୍ରାକୃତିକ ଛାଇ ପାଇଁ ଦେଶୀ ଗଛ ଲଗାଇବା ସବୁଠାରୁ ଭଲ ଉପାୟ।"
        }
    },
    bn: {
        welcome: "নমস্কার! আমি আপনার AI নগর সহকারী। তাপ প্রশমন বা ইভি স্টেশন সম্পর্কে আমাকে যেকোনো কিছু জিজ্ঞাসা করুন।",
        loading: "ভাবছি...",
        fallback: "আমি তাপমাত্রা ৩ ডিগ্রি সেলসিয়াস পর্যন্ত কমাতে হটস্পটগুলোতে গাছ লাগানোর পরামর্শ দিই।",
        keywords: {
            heat: "কুল রুফ এবং ফুটপাথ ব্যবহার করে শহরের তাপ কমানো যেতে পারে।",
            ev: "আপনার কাছে বেশ কয়েকটি ইভি স্টেশন রয়েছে। ম্যাপে নীল আইকনগুলো দেখুন।",
            tree: "প্রাকৃতিক ছায়া প্রদানের জন্য দেশীয় গাছ লাগানো সবচেয়ে কার্যকর উপায়।"
        }
    }
};

let currentLang = 'en';

langSelect.addEventListener('change', (e) => {
    currentLang = e.target.value;
    // Clear and add welcome message in new language
    chatMessages.innerHTML = "";
    addBotMessage(BOT_RESPONSES[currentLang]?.welcome || BOT_RESPONSES.en.welcome);
});

chatToggle.addEventListener('click', () => chatbot.classList.toggle('chatbot-collapsed'));
closeChat.addEventListener('click', () => chatbot.classList.add('chatbot-collapsed'));

function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `msg ${sender}`;
    div.innerText = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addBotMessage(text) {
    setTimeout(() => addMessage(text, 'bot'), 600);
}

function handleChat() {
    const text = chatInput.value.trim().toLowerCase();
    if (!text) return;

    addMessage(chatInput.value, 'user');
    chatInput.value = "";

    let response = BOT_RESPONSES[currentLang]?.fallback || BOT_RESPONSES.en.fallback;

    // Simple keyword matching for demo
    const data = BOT_RESPONSES[currentLang] || BOT_RESPONSES.en;
    for (let key in data.keywords) {
        if (text.includes(key)) {
            response = data.keywords[key];
            break;
        }
    }

    addBotMessage(response);
}

sendChat.addEventListener('click', handleChat);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChat();
});

/* ===============================
   ANALYTICS & CHARTS LOGIC
   =============================== */
let tempChart, vegChart, energyChart;

const toggleBtn = document.getElementById('toggle-analytics');
const mapArea = document.querySelector('.map-area');
const analyticsArea = document.querySelector('.analytics-area');

toggleBtn.addEventListener('click', () => {
    if (analyticsArea.style.display === 'none') {
        analyticsArea.style.display = 'block';
        mapArea.style.display = 'none';
        toggleBtn.innerHTML = '🗺️ Map View';
        initCharts();
    } else {
        analyticsArea.style.display = 'none';
        mapArea.style.display = 'block';
        toggleBtn.innerHTML = '📊 Analytics View';
    }
});

function initCharts() {
    const cityData = HOTSPOTS_DATA.filter(p => p.city === currentCity);
    const labels = cityData.map(p => p.area || "Zone");
    const temps = cityData.map(p => p.temp);
    const vegs = cityData.map(p => p.veg);

    // Destroy existing charts if they exist to avoid overlaps
    if (tempChart) tempChart.destroy();
    if (vegChart) vegChart.destroy();
    if (energyChart) energyChart.destroy();

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { labels: { color: '#fff', font: { family: 'Outfit', size: 12 } } }
        },
        scales: {
            y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
        }
    };

    // 1. Temperature Bar Chart
    tempChart = new Chart(document.getElementById('tempChart'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temps,
                backgroundColor: temps.map(t => t > 40 ? '#ef4444' : '#f97316'),
                borderRadius: 8
            }]
        },
        options: chartOptions
    });

    // 2. Vegetation Line Chart
    vegChart = new Chart(document.getElementById('vegChart'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Vegetation %',
                data: vegs,
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                fill: true,
                tension: 0.4
            }]
        },
        options: chartOptions
    });

    // 3. Energy Saving Potential
    energyChart = new Chart(document.getElementById('energyChart'), {
        type: 'doughnut',
        data: {
            labels: ['Cooling Efficiency', 'Energy Waste', 'Grid Resilience'],
            datasets: [{
                data: [65, 20, 15],
                backgroundColor: ['#3b82f6', '#ef4444', '#eab308'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right', labels: { color: '#fff', font: { family: 'Outfit' } } }
            },
            cutout: '70%'
        }
    });
}
