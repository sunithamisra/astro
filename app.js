// This is a sample application which you can use as a starting point for your
// project. The only parts you should *need* to change are indicated with `TODO`
// below. However, you are welcome to change more if you wish.

////////////////////////////////////////////////////////////////////////////////

var USER_OR_GROUP_NAME = 'sunithamisra'; 

////////////////////////////////////////////////////////////////////////////////

if (! USER_OR_GROUP_NAME) { 
  throw new Error(
    'You must set your GitHub username or group name in the app.js file'); 
}

// Import some utility functions.
var utils = require('./utils');

// Create a new web application.
var app = utils.initializeWebApp();

// Connect to your database.
var db = utils.connectToDatabase(USER_OR_GROUP_NAME);

// TODO: Start defining your resource handlers. You may just need to modify the
// examples below, or you may need to add additional handlers by copying,
// pasting, and modifying these examples.

////////////////////////////////////////////////////////////////////////////////
// Example of handling PUT to create or update a resource. /////////////////////
// Here we create or update an item using the ID specified in the URI. /////////
////////////////////////////////////////////////////////////////////////////////
app.put('/artists/:id',      // TODO: change to suit your URI design.
  function(req, res) {
  
    // Get the item ID from the URI.
    var item_id = req.params.id;

    // Get the item info that was PUT from the input form.
    // See the form in `views/list-parties.ejs`.
    var item = req.body.item;
    
    item.type = 'artist'; // TODO: change to the type of item you want

    // Save the new item to the database, specifying the ID.
    db.save(item_id, item, function(err) {

      // If there was a database error, return an error status.
      if (err) { res.send(err, 500); } 
      
      // Otherwise, redirect back to the URI from which the form was submitted.
      else { res.redirect('back' ); }
    });
  }
);

////////////////////////////////////////////////////////////////////////////////
// Example of handling PUT to create or update a resource. /////////////////////
// Here we create or update an item using the ID specified in the URI. /////////
////////////////////////////////////////////////////////////////////////////////
//app.put('/playlist/:id',      // TODO: change to suit your URI design.
app.put('/playlist/',  
  function(req, res) {
  
    // Get the item ID from the URI.
    var item_id = req.params.id;
    
    var item_type_playlist = 'playlist';
    var item_type_album = 'album'; 

    // Get the item info that was PUT from the input form.
    // See the form in `views/list-parties.ejs`.
    var item = req.body.item;
     
    console.log("Debug: PUTting Playlist", item);
    item.type = 'playlist'; 
    
    db.getAll(item_type_playlist, function(err, playlist_items) {
        
      db.getAll(item_type_album, function(err, album_items) {
       album_items.type = 'album';
       var albun_length = album_items.length;
       var playlist_length = playlist_items.length;
       
       //playlist_items.forEach(function(album_item) {
       console.log("Debug: ALBUM_ITEM_LENGTH: ", album_items.length);
       console.log("Debug: PLAYLIST_ITEM_LENGTH: ", playlist_items.length);
       console.log("Debug: Item.name = ", item.name);
      
       // Return if item is alrady in the playlist
       for (var i = 0; i < playlist_items.length; i++) {
           if (item.name == playlist_items[i].name) { 
             console.log("Present in the Playlist: i=%d, playlistlen=%d, pl_name=%s", i, playlist_items[i].length, playlist_items[i].name);
             return;
           }
       }
       
       // Return if item is not in the album
       for (i=0; i<album_items.length; i++) {
           if (item.name == album_items.name) {
               console.log("Found the item %s in the album", item.name);
               break;
           }
       }
     // If i is the length of the album, the item doesn't exist. So return.
     if (i >= album_items.length) {
         console.log("item %s not found in the album", item.name);
         return;
     }
       
     }); 
    });

    console.log("Debug: SAVING IN DB ", item.name);
    // Save the new item to the database, specifying the ID.
    db.save(item_id, item, function(err) {

      // If there was a database error, return an error status.
      if (err) { res.send(err, 500); } 
      
      // Otherwise, redirect back to the URI from which the form was submitted.
      else { res.redirect('back' ); }
    });
  }
);

// Delete the entire playlist
app.delete('/playlist/',
  function(req, res) {
    // Get the item ID from the URI.
    var item_id = req.params.id;
    
    // Get the item info that was PUT from the input form.
    // See the form in `views/one-artist.ejs`.
    var item = req.body.item;
    
    item.type = 'playlist';
    
    db.remove(item_id, item, function(err) {
       // If there was a database error, return an error status.

      if (err) { res.send(err, 500); }
      
      // Otherwise, redirect back to the URI from which the form was submitted.
      else { res.redirect('back' ); }
    }); 
  }
)

app.delete('/albums/:id',
  function(req, res) {
    // Get the item ID from the URI.
    var item_id = req.params.id;
    
    // Get the item info that was PUT from the input form.
    // See the form in `views/one-artist.ejs`.
    var item = req.body.item;
    
    item.type = 'album';
    
    db.remove(item_id, item, function(err) {
       // If there was a database error, return an error status.

      if (err) { res.send(err, 500); }
      
      // Otherwise, redirect back to the URI from which the form was submitted.
      else { res.redirect('back' ); }
    }); 
  }
)

////////////////////////////////////////////////////////////////////////////////
// Example of handling GET of a "collection" resource. /////////////////////////
// Here we list all items of type `party`. /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
app.get('/artists/',         // TODO: change to suit your URI design. 
  function(req, res) {

    var item_type = 'artist'; // TODO: change to the type of item you want.

    // Get all items of the specified type from the database.
    db.getAll(item_type, function(err, items) {

      // If there was a database error, return an error status.
      if (err) { res.send(err, 500); } 

      // Otherwise, use the returned data to render an HTML page.
      else {
        res.render(
          'list-artists',   // TODO: change to the name of your HTML template.
          { items: items }
        );
      }
    });
  }
);

//app.get('/playlist/', '/albums/',        // TODO: change to suit your URI design. 
app.get('/playlist/',  
  function(req, res) {

    var item_type_playlist = 'playlist'; // TODO: change to the type of item you want.
    var item_type_album = 'album';

    // Get all items of the specified type from the database.
    db.getAll(item_type_playlist, function(err, items) {
      db.getAll(item_type_album, function(err, album_items) {    
        // If there was a database error, return an error status.
        if (err) { res.send(err, 500); } 

        // Otherwise, use the returned data to render an HTML page.
        else {
          //res.render(
           //'playlist',  // TODO: change to the name of your HTML template.
           // { items: items} , 'albums', {album_items:items}
          //);
          res.render('playlist', {items: items, albums: album_items });
        }
      });
    });
  }
);

////////////////////////////////////////////////////////////////////////////////
// Example of handling POST to create a resource. //////////////////////////////
// Here we create an item and allow the ID to be created automatically. ////////
////////////////////////////////////////////////////////////////////////////////
app.post('/albums/', // TODO: change to suit your URI design.
  function(req, res) {
  
    // Get the item info that was POSTed from the input form.
    // See the form in `views/one-album.ejs`.
    var item = req.body.item;

    item.type = 'album'; // TODO: change to the type of item you want

    // Save the new item to the database. (No ID specified, it will be created.)
    db.save(item, function(err) {

      // If there was a database error, return an error status.
      if (err) { res.send(err, 500); } 
      
      // Otherwise, redirect back to the URI from which the form was submitted.
      else { res.redirect('back' ); }
    });
  }
);

////////////////////////////////////////////////////////////////////////////////
// Another example of handling PUT to update a resource. ///////////////////////
// Here we update an item using the ID specified in the URI. ///////////////////
////////////////////////////////////////////////////////////////////////////////
app.put('/albums/:id', // TODO: change to suit your URI design.
  function(req, res) {
  
    // Get the item ID from the URI.
    var item_id = req.params.id;

    // Get the item info that was PUT from the input form.
    // See the form in `views/one-artist.ejs`.
    var item = req.body.item;

    item.type = 'album'; // TODO: change to the type of item you want

    // Save the new item to the database, specifying the ID.
    db.save(item_id, item, function(err) {

      // If there was a database error, return an error status.
      if (err) { res.send(err, 500); } 
      
      // Otherwise, redirect back to the URI from which the form was submitted.
      else { res.redirect('back' ); }
    });
  }
);

////////////////////////////////////////////////////////////////////////////////
// Another example of handling GET of a "collection" resource. /////////////////
// This time we support filtering the list by some criteria (i.e. searching). //
////////////////////////////////////////////////////////////////////////////////
app.get('/albums/',          // TODO: change to suit your URI design. 
  function(req, res) {

    var item_type = 'album'; // TODO: change to the type of item you want.

    // Get items of the specified type that match the query.
    db.getSome(item_type, req.query, function(err, items) {

      // If there was a database error, return an error status.
      if (err) { res.send(err, 500); } 

      // Otherwise, use the returned data to render an HTML page.
      else {
        res.render(
          'list-albums', // TODO: change to the name of your HTML template.
          { items: items }
        );
      }
    });
  }
);

////////////////////////////////////////////////////////////////////////////////
// An example of handling GET of a "single" resource. //////////////////////////
// This handler is more complicated, because we want to show not only the //////
// item requested, but also links to a set of related items. ///////////////////
////////////////////////////////////////////////////////////////////////////////
app.get('/artists/:id',      // TODO: change to suit your URI design.
  function(req, res) {

    var item_type = 'artist'; // TODO: change to the type of item you want.

    // Get the item ID from the URI.
    var item_id = req.params.id;
  

    // Get one item of the specified type, identified by the item ID.
    db.getOne(item_type, item_id, function(err, item) {
        
      // If there was a database error, return an error status.
      if (err) {
        if (err.error == 'not_found') { res.send(404); }
        else { res.send(err, 500); }
      } 

      // Otherwise, get the related items associated with this item.
      else {
        
        var related_type = 'album'; // TODO: change to type of related item.

        // Set our query to find the items related to the requested item.
        req.query.album = item_id; // TODO: change `party` to reflect the
                                   // relation between the item fetched above
                                   // and the related items to be fetched below.

        // Get items of the specified type that match the query.
        db.getSome(related_type, req.query, function(err, items) {

          // If there was a database error, return an error status.
          if (err) { res.send(err, 500); } 

          // Otherwise, use the returned data to render an HTML page.
          else {
            res.render(
            'one-artist', // TODO: change to the name of your HTML template.
              { item: item, related_items: items }
            );
          }
        });
      }
    });
  }
);

////////////////////////////////////////////////////////////////////////////////
// An example of handling GET of a "single" resource. //////////////////////////
// This handler is also complicated, because we want to show not only the //////
// item requested, but also a list of potential related items, so that users ///
// can select from a list when updating the item. //////////////////////////////
////////////////////////////////////////////////////////////////////////////////
app.get('/albums/:id',       // TODO: change to suit your URI design.
  function(req, res) {

    var item_type = 'album'; // TODO: change to the type of item you want.
    //var item_type_artist = 'artist';

    // Get the item ID from the URI.
    var item_id = req.params.id;
  
    // Get one item of the specified type, identified by the item ID.
    db.getOne(item_type, item_id, function(err, item) {
     // db.getOne(item_type_artist, item_id, function(err, item_artist) {
        
      // If there was a database error, return an error status.
      if (err) {
        if (err.error == 'not_found') { res.send(404); }
        else { res.send(err, 500); }
      } 

      // Otherwise, get the items potentially related to this item.
      else {
        
        var related_type = 'artist'; // TODO: change to type of related item.

        // Get all items of the specified related type.
        db.getAll(related_type, function(err, items) {

          // If there was a database error, return an error status.
          if (err) { res.send(err, 500); } 

          // Otherwise, use the returned data to render an HTML page.
          else {
            res.render(
              'one-album', // TODO: change to name of your HTML template.
              { item: item, related_items: items }
            );
          }
        });
      }
    });
  }
);


// Handle GET of the "index" resource.
app.get('/', function(req, res) { res.render('index'); });

// Start listening for incoming HTTP connections.
app.listen(process.env.PORT);
