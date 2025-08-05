  import {Termino} from 'https://cdn.jsdelivr.net/gh/MarketingPipeline/Termino.js@latest/dist/termino.min.js';
            import ansiUp from "https://cdn.skypack.dev/ansi_up@5.1.0";

import nightmarebotChalk from 'https://cdn.skypack.dev/@nightmarebot/chalk';

            let ansi_up = new ansiUp();
            let term = Termino(document.getElementById("terminal"));
            
         


let chalk = nightmarebotChalk

async function getData(input) {
  await fetch(`https://www.omdbapi.com/?t=${input}&type=movie&apikey=fd161998`)
    .then(res => {
      return res.json();
    })
    .then(json => {
  
      const html = json
      if(html.Response === "False"){
        throw({message:"Nothing Found"})
      }
       const formatDate = string => {
  const [strMminutes] = string.split(' ');
  const hours = Number(strMminutes) / 60;
  const rhours = Math.round(hours);
  const minutes = (hours - rhours) * 60;
  const rminutes = Math.abs(Math.round(minutes));
  return `${rhours}h${rminutes}min`;
};
     let result = html 
     const movieRes = `
  ${chalk.black.bgYellow.bold(result.Title)} (${result.Year}) on IMDb:
  ${chalk.yellow(`☆ ${result.imdbRating}`)}
  Duration: .... ${formatDate(result.Runtime)}
  Director: .... ${result.Director}
  Writer: ...... ${result.Writer}
  Stars: ....... ${result.Actors}
  Genre: ....... ${chalk.italic(result.Genre)}
  Plot: ... ${result.Plot}
    `;

   term.output(ansi_up.ansi_to_html(movieRes));
    })
    .catch(error => {
     term.output(error.message);
    });
}

async function start(){
await getData(await term.input("What movie do you want to search info for:"))
start()
}
start()
