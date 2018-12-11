var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {

  app.get( ,(req, res) => {
    res.send('Hello')
  })

 	app.get('/notes/:title', (req, res) => {
    	const title = req.params.title;
    	const details = { 'title': new ObjectID(id) };
    	db.collection('notes').findOne(details, (err, item) => {
      		if (err) {
        		res.send({'error':'An error has occurred'});
      		} else {
        		res.send(item);
      			} 
    	});
	});
  /*


  */
  
 	app.post('/notes', (req, res) => {
    	const note = { text: req.body.body, title: req.body.title };
    	db.collection('notes').insert(note, (err, result) => {
      		if (err) { 
        		res.send({ 'error': 'An error has occurred' }); 
      		} else {
        		res.send(result.ops[0]);
      		}
    	});
 	 });

 	app.get('/notes', (req, res) => {
 		db.collection('notes').find().toArray(function(err, docs) {
 			if (err) {
 				console.log('error: ' + err)
 			} else {
 				res.status(200).json(docs)
 				
 			}
 		})

 	})


    app.put('/notes/:title', (req, res) => {
      const note = { text: req.body.body, title: req.body.title };
      const noteToUpdate = db.collection('notes').find({ title: note.title })
      notetoUpdate.insert(note, (err, result) => {
          if (err) { 
            res.send({ 'error': 'An error has occurred' }); 
          } else {
            res.send(result.ops[0]);
          }
      });
   });
};