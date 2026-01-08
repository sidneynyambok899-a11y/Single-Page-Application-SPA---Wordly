
// Dictionary app variables
var searchForm = document.getElementById('searchForm');
var wordInput = document.getElementById('wordInput');
var loading = document.getElementById('loading');
var error = document.getElementById('error');
var results = document.getElementById('results');
var wordTitle = document.getElementById('wordTitle');
var pronunciation = document.getElementById('pronunciation');
var audioBtn = document.getElementById('audioBtn');
var definitions = document.getElementById('definitions');
var currentAudio;

// When form is submitted
searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var word = wordInput.value.trim();
    
    if (word === '') {
        showError('Please enter a word');
        return;
    }
    
    searchWord(word);
});

// Function to search for a word
function searchWord(word) {
    showLoading();
    hideError();
    hideResults();
    
    // API URL
    var apiUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + word;
    
    // Fetch data from API
    fetch(apiUrl)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Word not found');
            }
            return response.json();
        })
        .then(function(data) {
            displayResults(data[0]);
        })
        .catch(function(err) {
            showError('Word not found. Please try another word.');
        })
        .finally(function() {
            hideLoading();
        });
}

// Function to result display
function displayResults(wordData) {
    wordTitle.textContent = wordData.word;
    
    // Show pronunciation
    var phonetic = '';
    if (wordData.phonetics && wordData.phonetics.length > 0) {
        for (var i = 0; i < wordData.phonetics.length; i++) {
            if (wordData.phonetics[i].text) {
                phonetic = wordData.phonetics[i].text;
                break;
            }
        }
    }
    pronunciation.textContent = phonetic || 'No pronunciation available';
    
    // Handle audio
    var audioUrl = '';
    if (wordData.phonetics && wordData.phonetics.length > 0) {
        for (var i = 0; i < wordData.phonetics.length; i++) {
            if (wordData.phonetics[i].audio) {
                audioUrl = wordData.phonetics[i].audio;
                break;
            }
        }
    }
    
    if (audioUrl) {
        currentAudio = new Audio(audioUrl);
        audioBtn.style.display = 'inline-block';
    } else {
        audioBtn.style.display = 'none';
    }
    
    // Show definitions
    definitions.innerHTML = '';
    
    for (var i = 0; i < wordData.meanings.length; i++) {
        var meaning = wordData.meanings[i];
        
        var definitionDiv = document.createElement('div');
        definitionDiv.className = 'definition';
        
        var partOfSpeech = document.createElement('div');
        partOfSpeech.className = 'partOfSpeech';
        partOfSpeech.textContent = meaning.partOfSpeech;
        definitionDiv.appendChild(partOfSpeech);
        
        // Show up to 3 definitions
        for (var j = 0; j < Math.min(meaning.definitions.length, 3); j++) {
            var def = meaning.definitions[j];
            
            var meaningDiv = document.createElement('div');
            meaningDiv.className = 'meaning';
            meaningDiv.textContent = (j + 1) + '. ' + def.definition;
            definitionDiv.appendChild(meaningDiv);
            
            if (def.example) {
                var exampleDiv = document.createElement('div');
                exampleDiv.className = 'example';
                exampleDiv.textContent = 'Example: ' + def.example;
                definitionDiv.appendChild(exampleDiv);
            }
        }
        
        // Show synonyms if available
        if (meaning.synonyms && meaning.synonyms.length > 0) {
            var synonymsDiv = document.createElement('div');
            synonymsDiv.className = 'synonyms';
            synonymsDiv.innerHTML = '<strong>Synonyms: </strong>';
            
            for (var k = 0; k < Math.min(meaning.synonyms.length, 5); k++) {
                var synonymSpan = document.createElement('span');
                synonymSpan.className = 'synonym';
                synonymSpan.textContent = meaning.synonyms[k];
                synonymSpan.onclick = function() {
                    wordInput.value = this.textContent;
                    searchWord(this.textContent);
                };
                synonymsDiv.appendChild(synonymSpan);
            }
            
            definitionDiv.appendChild(synonymsDiv);
        }
        
        definitions.appendChild(definitionDiv);
    }
    
    showResults();
}

// Audio button click
audioBtn.addEventListener('click', function() {
    if (currentAudio) {
        currentAudio.play();
    }
});

// Helper functions
function showLoading() {
    loading.style.display = 'block';
}

function hideLoading() {
    loading.style.display = 'none';
}

function showError(message) {
    error.textContent = message;
    error.style.display = 'block';
}

function hideError() {
    error.style.display = 'none';
}

function showResults() {
    results.style.display = 'block';
}

function hideResults() {
    results.style.display = 'none';
}
