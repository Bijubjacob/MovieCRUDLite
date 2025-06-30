const express = require("express");
const app = express();

app.use(express.static(__dirname + '/client'))

// Start MongoDB Atlas ********
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const mongoose = require("mongoose");

const mongooseUri = "mongodb+srv://MovieCRUDUser:2cXNj2TeRSsHaniL@cluster0.71bgnhg.mongodb.net/movieDatabase"
mongoose.connect(mongooseUri, {useNewUrlParser: true}, {useUnifiedTopology: true})
const movieSchema = {
	title: String,
	comments: String
}
const Movie = mongoose.model("movie", movieSchema);

// Create route called from create.html
app.post("/create", function(req, res){
	let newNote = new Movie({
		title: req.body.title,
		comments: req.body.comments
	})
	
	newNote.save();
	res.redirect("/");
})

const renderNotes = (notesArray) => {
	let text = "Movies Collection:\n\n";
	notesArray.forEach((note)=>{
		text += "Title: " + note.title  + "\n";
		text += "Comments: " + note.comments  + "\n";
		text += "ID:" + note._id + "\n\n";
	})
	text += "Total Count: " + notesArray.length;
	return text
}

app.get("/read", function(request, response) {
	Movie.find({}).then(notes => { 
		response.type('text/plain');
		response.send(renderNotes(notes));
	})
})

// Todo: Implement your own MongoDB Atlas Organization, Project, Database Cluster, Database, and Collection.
// Todo: Implement and test the Update and Delete functionCRUD.
// Update route called from update.html
app.get("/update", function(req, res) {
	res.sendFile(__dirname + "/client/update.html");
});

app.post("/update", async function(req, res) {
	// This is a placeholder for the update functionality.
	const { id, title, comments } = req.body;
	if (!id || !title || !comments) {
		return res.status(400).send("Missing required fields: id, title, or comments.");
	}
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send("Invalid ID format.");
	}
	try {
		await Movie.updateOne({ _id: id }, { title, comments });
		res.redirect("/read");
	} catch (error) {
		res.status(500).send("Error updating movie: " + error.message);
	}
});

// Delete route called from delete.html
app.get("/delete", function(req, res) {
	res.sendFile(__dirname + "/client/delete.html");
});

app.post("/delete", async function(req, res) {
	// This is a placeholder for the delete functionality.
	const title = req.body.title;
	if (!title) {
		return res.status(400).send("Missing required field: title.");
	}

		try {
			const result = await Movie.deleteOne({ title: title });
			if (result.deletedCount === 0) {
				return res.status(404).send("Movie not found.");
			}
			res.redirect("/read");
		} catch (error) {
			res.status(500).send("Error deleting movie: " + error.message);
		}
	});

		
// End MongoDB Atlas ********

const port = process.env.PORT || 3000;
app.get('/test', function(request, response) {
	response.type('text/plain')
	response.send('Node.js and Express running on port='+port)
})

app.listen(port, function() {
	console.log("Server is running at http://localhost:3000/")
})
