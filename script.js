const searchBar = document.getElementById('searchBar');
const resultsList = document.getElementById('resultsList');
const clearBtn = document.getElementById('clearBtn');
let abbreviations = [];

// 1. Fetch Data
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        abbreviations = data;
    })
    .catch(err => console.error("Data load failed:", err));

// 2. Search Logic
function filterResults() {
    const query = searchBar.value.toLowerCase().trim();

    // Toggle Clear Button Visibility
    clearBtn.style.display = query.length > 0 ? "block" : "none";

    if (query === "") {
        displayItems([]);
        return;
    }

    const filtered = abbreviations.filter(item => 
        item.term.toLowerCase().includes(query) || 
        item.def.toLowerCase().includes(query)
    );

    displayItems(filtered);
}

// 3. Display Logic
function displayItems(items) {
    if (searchBar.value.trim() === "") {
        resultsList.innerHTML = "";
        return;
    }

    if (items.length === 0) {
        resultsList.innerHTML = `<div style="text-align:center; padding:20px; opacity:0.6;">No matches found.</div>`;
        return;
    }

    resultsList.innerHTML = items.map(item => `
        <div class="result-item">
            <div>
                <div class="abbr-term">${item.term}</div>
                <div class="abbr-def">${item.def}</div>
            </div>
            <button class="copy-btn" onclick="copyText('${item.term}: ${item.def}', this)">Copy</button>
        </div>
    `).join('');
}

// 4. Clear Search
function clearSearch() {
    searchBar.value = "";
    filterResults();
    searchBar.focus();
}

// 5. Copy to Clipboard
function copyText(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        const oldText = btn.innerText;
        btn.innerText = "Copied!";
        setTimeout(() => btn.innerText = oldText, 2000);
    });
}

// 6. Dark Mode Toggle

function toggleTheme() {
    const doc = document.documentElement;
    // Check if it's currently dark
    const isDark = doc.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    
    // Apply the theme
    doc.setAttribute('data-theme', newTheme);
    localStorage.setItem('mil_theme', newTheme);
    
    // Update the button text
    const btn = document.getElementById('themeToggle');
    btn.innerText = newTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
}

// Load Saved Theme
const savedTheme = localStorage.getItem('mil_theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'dark') document.getElementById('themeToggle').innerText = '☀️ Light';
}
