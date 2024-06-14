const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const uri = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/test?retryWrites=true&w=majority)";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));    

const authorSchema = new mongoose.Schema({
    name: String,
});

const Author = mongoose.model('Author', authorSchema);

app.use(bodyParser.json());

app.get('/api/authors', async (req, res) => {
    try {
        const authors = await Author.find({}, { name: 1 });
        res.json(authors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/authors', async (req, res) => {
    const author = new Author({
        name: req.body.name
    });

    try {
        const newAuthor = await author.save();
        res.status(201).json(newAuthor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/authors/:id', async (req, res) => {
    const id = req.params.id;
  
    try {
      const deletedAuthor = await Author.findByIdAndDelete(id);
      if (deletedAuthor) {
        res.status(204).json(); // No content returned on successful delete
      } else {
        res.status(404).json({ message: "Author not found." });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
