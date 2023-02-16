const notes = require('express').Router();
const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId({ length: 10 }); //https://www.npmjs.com/package/short-unique-id
const { readAndAppend, readFromFile, writeToFile } = require('../helpers/fsUtils');
const db = require('../db/db.json');
const fs = require('fs');


// GET Route for retrieving all the notes
notes.get('/', (req, res) =>
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
);

// GET route that returns data with specific id 
notes.get('/:id', (req, res) =>{
    for(let i=0; i<db.length; i++){
        if(db[i].id === req.params.id){
            return res.json(db[i]);
        }
    }
});

// POST Route to read and append note
notes.post('/', (req, res) => {
    const { title, text } = req.body;

    if (title && text) {

        const newNotes = {
            title,
            text,
            id: uid(),
        };

        readAndAppend(newNotes, './db/db.json');

        const response = {
            status: 'success',
            body: newNotes,
        };

        console.log(db);
        console.log(db.length);
        
        res.json(response);
    } else {
        res.json('Error in saving notes');
    }
});

// DELETE route to delete note based on requested id
// https://www.tabnine.com/code/javascript/functions/express/Express/delete
notes.delete('/:id', (req, res) => {
    const id = req.params.id;
    
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          const parsedData = JSON.parse(data);
            //find index of note matches requested id
          const noteIndex = parsedData.findIndex(note => note.id == id); 

          parsedData.splice(noteIndex, 1);
          
          writeToFile('./db/db.json', parsedData);

          res.send(`${id}: Note has been deleted.`);
        }
      });
});

module.exports = notes;