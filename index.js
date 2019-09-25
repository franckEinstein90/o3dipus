
//const express = require('express'); 
//const app = express();
//const unirest=require("unirest")
const urlencode = require('urlencode')
const MongoClient = require('mongodb').MongoClient; 
//const port = 8080;

const password = urlencode("ZiLQFLuK6c") 
const uri = `mongodb+srv://MaryHill:${password}@cluster0-iomua.mongodb.net/test?retryWrites=true&w=majority`;
console.log(uri); 
const client = new MongoClient(uri, { useNewUrlParser: true });

const collection = null
client.connect(err => {
	if( err ) {
		console.log('error while connecting' + err); 
	}else{
		console.log('connected'); 
		collection = client.db("world").collection("countries");
		// perform actions on the collection object
		client.close();
	}
});


/*var req = unirest("GET", "https://restcountries-v1.p.rapidapi.com/all")
req.headers({
	"x-rapidapi-host": "restcountries-v1.p.rapidapi.com",
	"x-rapidapi-key": "ac56b39f61msh94657a9e072fd89p1ef653jsn631b4d9bc78b"
});


req.end(function (res) {
	if (res.error) throw new Error(res.error);
	console.log(res.body)
});*/

/*
app.get("/", (req, res, next) => {
	res.send('hello world')
});


app.use(express.static('docs'))
app.listen(port, () => {console.log(`Server running on port ${port}`)});
*/
