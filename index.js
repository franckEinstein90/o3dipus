
const express = require('express'); 
const app = express();
app.use(express.static('docs'))

const port = 8080;



app.get("/", (req, res, next) => {
	res.send('hello world')
});


app.listen(port, () => {console.log(`Server running on port ${port}`)});

