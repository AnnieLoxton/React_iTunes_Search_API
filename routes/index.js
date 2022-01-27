var express = require('express');
var ROUTER = express.Router();
const fs = require('fs');

/*Node-fetch allows you to use fetch in node.js files.
See:
https://www.npmjs.com/package/node-fetch#installation and
https://stackabuse.com/making-http-requests-in-node-js-with-node-fetch/*/
const fetch = require('node-fetch');

//Get and parse the array from the json files.
const favourites = JSON.parse(fs.readFileSync('./data/favourites.json'));
const searchResults = JSON.parse(fs.readFileSync('./data/searchResults.json'));

// GET - to display the components on the page.
ROUTER.get('/search', (request, response) => {
  response.send(searchResults);
});

ROUTER.get('/favourites', (request, response) => {
  response.send(favourites);
});

//GET - when user does not pick a media type
ROUTER.get('/get/:search', (request, response) => {
    //Get the search info
    const searchTerm = request.params.search;

    //Splice the array so that the new data overrides the old data
    searchResults.splice(0, searchResults.length);
    //Fetch request to the API, which then pushes the data into the json file.
    async function fetchData() {
        try {
          const fetchData = await fetch(`https://itunes.apple.com/search?term=${searchTerm}`);
          const processData = await fetchData.json();   

          for (let i = 0; i < (await processData.results.length); i++) {
            searchResults.push(await processData.results[i]);
          } 
          fs.writeFile(
            './data/searchResults.json',
            JSON.stringify(searchResults, null, 2),
            (error) => {
              if (error) throw error;
              else console.log('Search successful');
            }
          );    
          return response.json({ searchResults });
        } catch (error) {
          console.log(`Failed: ${error}`);
        }
    }

  fetchData();
});

//GET - when user selects a media category.
ROUTER.get('/getMedia/:search/:mediaType', (request, response) => {
    const searchTerm = request.params.search;
    const mediaType = request.params.mediaType;

    //Splice the array so that the new data overrides the old data
    searchResults.splice(0, searchResults.length);
    //Fetch request to the API, which then pushes the data into the json file.  
    fetch(`https://itunes.apple.com/search?term=${searchTerm}${mediaType}`)
        .then((res) => res.json())
        .then(
          (result) => {
            for (let i = 0; i < result.results.length; i++) {
              searchResults.push(result.results[i]);
            }

            fs.writeFile(
              './data/searchResults.json',
              JSON.stringify(searchResults, null, 2),
              (error) => {
                if (error) throw error;
                else console.log('Search successful');
              }
            );

            return response.json({ searchResults });
          },
          (error) => {
            console.log(error);
          }
    );
});

//POST - adds data to favourites.json by using unique id.
ROUTER.post('/post/:id', (request, response) => {
    const id = request.params.id;
    const newFavourite = searchResults[id];

    //Push data into the array.
    favourites.push(newFavourite);

    fs.writeFile(
      './data/favourites.json',
      JSON.stringify(favourites, null, 2),
      (error) => {
        if (error) throw error;
        else console.log('favorites.json updated');
      }
    );

    return response.json({ favourites });
});

//DELETE - to remove data from the favourites.json file using unique id.
ROUTER.delete('/delete/:id', (request, response) => {
    const id = request.params.id;

    //Use splice() method to remove object from array.
    favourites.splice(id, 1);

    fs.writeFile(
        './data/favourites.json',
        JSON.stringify(favourites, null, 2),
        (error) => {
        if (error) throw error;
        else console.log('favourites.json updated');
        }
    );

    return response.json({ favourites });
});

module.exports = ROUTER;
