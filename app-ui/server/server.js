const express = require('express'); //calling express
const app = express();
const port = process.env.PORT || 5000; //port at 5000

app.use(express.json());
app.use(express.urlencoded());

// Posting components and links

app.post('/api/state/cache', function (req, res) {
	console.log(req.body);
	res.status(204).send();
});

app.listen(port, () => console.log(`Listening on port ${port}`));
