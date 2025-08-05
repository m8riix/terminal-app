const OMDB_API_KEY = 'fd161998';
const output = document.getElementById('output');
const input = document.getElementById('input');
let commandHistory = [];
let historyIndex = -1;

// Event listeners
input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        const query = input.value.trim();
        if (query) {
            await handleCommand(query);
            commandHistory.push(query);
            historyIndex = commandHistory.length;
            input.value = '';
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            input.value = commandHistory[historyIndex];
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            input.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            input.value = '';
        }
    }
});

async function handleCommand(command) {
    // Add command to output
    output.innerHTML += `<div class="command-history">&gt; ${command}</div>`;
    
    if (command.toLowerCase() === 'help') {
        showHelp();
    } else if (command.toLowerCase() === 'clear') {
        clearTerminal();
    } else {
        await searchMovie(command);
    }
    
    // Scroll to bottom
    output.scrollTop = output.scrollHeight;
}

function showHelp() {
    output.innerHTML += `
        <div class="help">
            <div>Available commands:</div>
            <div><span class="help-command">movie name</span> - Search for a movie</div>
            <div><span class="help-command">help</span> - Show this help message</div>
            <div><span class="help-command">clear</span> - Clear the terminal</div>
            <div><span class="help-command">↑/↓</span> - Navigate command history</div>
        </div>
    `;
}

function clearTerminal() {
    output.innerHTML = `
        <div class="prompt-line">
            <span class="prompt">What movie do you want to search info for:</span>
        </div>
    `;
    output.innerHTML += '<div style="color: #888; margin-bottom: 20px;">Type a movie name to search, or "help" for commands</div>';
}

async function searchMovie(query) {
    // Show loading message
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'loading';
    loadingMsg.textContent = 'Searching...';
    output.appendChild(loadingMsg);
    
    try {
        // Use OMDB API
        const response = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(query)}&type=movie&apikey=${OMDB_API_KEY}`);
        const data = await response.json();
        
        // Remove loading message
        loadingMsg.remove();
        
        if (data.Response === 'True') {
            displayMovie(data);
        } else {
            output.innerHTML += '<div class="error">No movies found. Try another search.</div>';
        }
    } catch (error) {
        console.error('Error:', error);
        // Remove loading message if it still exists
        if (loadingMsg && loadingMsg.parentNode) {
            loadingMsg.remove();
        }
        output.innerHTML += '<div class="error">Error: Failed to fetch movie data. Please check your connection and try again.</div>';
    }
}

function displayMovie(movie) {
    // Format runtime
    let runtime = movie.Runtime;
    if (runtime && runtime !== 'N/A') {
        const minutes = parseInt(runtime);
        if (!isNaN(minutes)) {
            runtime = `${Math.floor(minutes / 60)}h${minutes % 60}min`;
        }
    }
    
    const movieHtml = `
        <div class="movie-info">
            <div class="movie-title">${movie.Title}</div> (${movie.Year}) on IMDb:
            <div><span class="rating">⭐ ${movie.imdbRating}</span></div>
            <div><span class="label">Duration:</span> .... ${runtime}</div>
            <div><span class="label">Director:</span> .... ${movie.Director}</div>
            <div><span class="label">Writer:</span> ...... ${movie.Writer}</div>
            <div><span class="label">Stars:</span> ....... ${movie.Actors}</div>
            <div><span class="label">Genre:</span> ....... <span class="genre">${movie.Genre}</span></div>
            ${movie.Plot !== 'N/A' ? `<div class="plot">Plot: ${movie.Plot}</div>` : ''}
        </div>
    `;
    
    output.innerHTML += movieHtml;
}

// Initial help message
output.innerHTML += '<div style="color: #888; margin-bottom: 20px;">Type a movie name to search, or "help" for commands</div>';

// Keep input focused
input.focus();
document.addEventListener('click', () => input.focus());
