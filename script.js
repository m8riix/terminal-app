document.getElementById('input-field').addEventListener('keydown', async function (e) {
  if (e.key === 'Enter') {
    const query = this.value.trim();
    if (query) {
      document.getElementById('output').innerText = "Searching...";
      try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=bf99b4e624a319715068fad2ea7e4886&query=${encodeURIComponent(query)}`);
        const data = await response.json();
        if (data.results.length > 0) {
          const movie = data.results[0];
          document.getElementById('output').innerText = `Found: ${movie.title} (${movie.release_date})`;
        } else {
          document.getElementById('output').innerText = "No movies found.";
        }
      } catch (err) {
        document.getElementById('output').innerText = "Error fetching data.";
      }
    }
  }
});
