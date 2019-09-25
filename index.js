
//const express = require('express'); 
//const app = express();
const unirest=require("unirest")

//const port = 8080;

var req = unirest("GET", "https://restcountries-v1.p.rapidapi.com/all")
req.headers({
	"x-rapidapi-host": "restcountries-v1.p.rapidapi.com",
	"x-rapidapi-key": "ac56b39f61msh94657a9e072fd89p1ef653jsn631b4d9bc78b"
});

req.end(function (res) {
	if (res.error) throw new Error(res.error);
	console.log(res.body)
});

/*
app.get("/", (req, res, next) => {
	res.send('hello world')
});


app.use(express.static('docs'))
app.listen(port, () => {console.log(`Server running on port ${port}`)});
*/
