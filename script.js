
const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const results = document.getElementById('results');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const word = input.value.trim();
  if (!word) {
    results.innerHTML = "<p>Please enter a word.</p>";
    return;
  }

  results.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!response.ok) throw new Error('Word not found');
    const data = await response.json();
    displayWordData(data[0]); // use the first entry
  } catch (error) {
    results.innerHTML = `<p>Error: ${error.message}</p>`;
  }
});

function displayWordData(data) {
  // Show all phonetics and audio
  const phoneticsHTML = data.phonetics.map(p => {
    const audioTag = p.audio ? `<audio controls src="${p.audio}"></audio>` : "";
    return `<p>${p.text || ""} ${audioTag}</p>`;
  }).join('');

  // Show all meanings
  const meaningsHTML = data.meanings.map(meaning => {
    const definitionsHTML = meaning.definitions.map(def => `
      <p>${def.definition}</p>
      ${def.example ? `<p><em>Example: ${def.example}</em></p>` : ""}
      ${def.synonyms.length ? `<p><strong>Synonyms:</strong> ${def.synonyms.join(', ')}</p>` : ""}
    `).join('');
    return `
      <div class="definition">
        <h3>${meaning.partOfSpeech}</h3>
        ${definitionsHTML}
      </div>
    `;
  }).join('');

  results.innerHTML = `
    <h2>${data.word}</h2>
    <div>${phoneticsHTML}</div>
    ${meaningsHTML}
    ${data.origin ? `<p><strong>Origin:</strong> ${data.origin}</p>` : ""}
  `;
}
