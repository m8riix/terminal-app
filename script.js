import { Termino } from 'https://cdn.jsdelivr.net/gh/MarketingPipeline/Termino.js@latest/dist/termino.min.js';
import ansiUp from "https://cdn.skypack.dev/ansi_up@5.1.0";
import nightmarebotChalk from 'https://cdn.skypack.dev/@nightmarebot/chalk';

let ansi_up = new ansiUp();
let term = Termino(document.getElementById("terminal"));
let chalk = nightmarebotChalk;

async function getData(input) {
  const apiKey = 'bf99b4e624a319715068fad2ea7e4886';
  
  // Step 1: Search for the movie by title
  const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(input)}&page=1`;
  const searchResponse = await fetch(searchUrl);
  const searchData = await searchResponse.json();
  
  if (searchData.total_results === 0) {
    throw { message: "Nothing Found" };
  }
  
  // Get the first result's ID
  const movieId = searchData.results[0].id;
  
  // Step 2: Fetch detailed movie info
  const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;
  const detailsResponse = await fetch(detailsUrl);
  const result = await detailsResponse.json();
  
  // Format runtime (e.g., 150 -> "2h30min")
  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins}min`;
  };
  
  // Build the formatted output
  const movieRes = `
${chalk.black.bgYellow.bold(result.original_title)} (${result.release_date ? result.release_date.slice(0, 4) : 'N/A'}) on TMDb:
${chalk.yellow(`☆ ${result.vote_average.toFixed(1)}`)} (based on ${result.vote_count} votes)

Overview: ${result.overview || 'N/A'}
Runtime: ${formatRuntime(result.runtime)}
Genres: ${result.genres ? result.genres.map(g => g.name).join(', ') : 'N/A'}
Popularity: ${result.popularity.toFixed(1)}
`;

  return ansi_up.ansi_to_html(movieRes);  // Convert ANSI to HTML for display
}

// Handle input commands
const inputField = document.getElementById('input-field');
inputField.addEventListener('keydown', async (event) => {
  if (event.key === 'Enter') {
    const cmd = inputField.value.trim();
    if (cmd) {
      // Display the command
      term.print(`> ${cmd}`);
      
      try {
        const output = await getData(cmd);
        term.print(output);
      } catch (error) {
        term.print(chalk.red(error.message));
      }
      
      // Clear input
      inputField.value = '';
    }
  }
});

// Initial welcome message
term.print(chalk.green('Welcome to Movie Terminal! Type a movie title and press Enter.'));
