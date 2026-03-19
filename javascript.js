const searchBar = document.getElementById('searchBar');
const resultsList = document.getElementById('resultsList');
let abbreviations = []; 

// Load data from data.json
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        abbreviations = data;
    })
    .catch(error => console.error('Error loading JSON:', error));

function displayItems(items) {
    const query = searchBar.value.trim();

    // Start with blank screen if no input
    if (query === "") {
        resultsList.innerHTML = "";
        return;
    }

    // Show message if no results found
    if (items.length === 0) {
        resultsList.innerHTML = `<div style="color:#95a5a6; margin-top:20px;">No results found for "${query}"</div>`;
        return;
    }

    // Generate result cards with a Copy button
    resultsList.innerHTML = items.map(item => `
        <div class="result-item">
            <div class="abbr-text">
                <span class="abbr-term">${item.term}</span>
                <span class="abbr-def">${item.def}</span>
            </div>
            <button class="copy-btn" onclick="copyToClipboard('${item.term}: ${item.def}', this)">Copy</button>
        </div>
    `).join('');
}

function filterResults() {
    const query = searchBar.value.toLowerCase().trim();
    
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

// Utility function to copy text
function copyToClipboard(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = btn.innerText;
        btn.innerText = "Copied!";
        btn.style.backgroundColor = "#27ae60";
        btn.style.color = "white";
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.backgroundColor = "";
            btn.style.color = "";
        }, 2000);
    });
}