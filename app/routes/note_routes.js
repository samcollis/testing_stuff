var ObjectID = require('mongodb').ObjectID;


module.exports = function(app, db) {

  app.get('/', (req, res) => {
    res.send('hello world')
  })

 	app.get('/notes/:title', (req, res) => {
    	const title = req.params.title;
    	const details = { 'title': new ObjectID(id) };
    	db.collection('notes').findOne(req.params.title, (err, item) => {
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


    app.put('/notes/:id', (req, res) => {
      const note = { id: req.body.id, title: req.body.title };
      db.collection('notes').updateOne({id: note.id}, {$set: {title: note.title}}, (err, item) => {
          if (err) { 
            res.send({ 'error': 'An error has occurred' }); 
          } else {
            res.send(result.ops[0]);
          }
      });
  });
};