const axios = require('axios');
const config = require('../config/config');

// Main homepage
exports.get = async (req, res) => {
	
	try {
		// GET: Video Service
		let {data} = await axios.get(`${config.videoServiceUrl}/anchor`);
		res.render('anchor', {title: 'Anchor', data});	// Rendering the anchor view and passing the videos
	}
	catch (err) {
		console.error(err.code);
		res.send(err.code);
	}
}

// POST function
exports.post = async (req, res) => {

	let postData = req.body;
	console.log(postData);

	try {
		// POST: Video Service
		let {data} = await axios.post(`${config.videoServiceUrl}/anchor`, postData);
		console.log(data);
		res.redirect('/anchor');	// Redirecting to main page

	}
	catch (err) {
		console.error(err.code);
		res.send(err.code);
	}
}

// In-line edit
exports.editable = async (req, res) => {

	const postData = req.body;
	console.log('In-line updated value', postData);

	const { name, value, pk } = postData;

	try {
		// PUT: Video Service
		let {data} = await axios.put(`${config.videoServiceUrl}/anchor?_id=${pk}`, {[name]: value});
		console.log(data);
		res.send(data);
	}
	catch (err) {
		console.error(err.code);
		res.send(err.code);
	}
}

// DELETE function
exports.delete = async (req, res) => {

	const { _id } = req.query;

	try {
		// DELETE: Video Service
		let {data} = await axios.delete(`${config.videoServiceUrl}/anchor?_id=${_id}`);
		console.log(data);
		res.send(data);
	}
	catch (err) {
		console.error(err.code);
		res.send(err.code);
	}
}

// For fastSelect HTML, which is used on video page
exports.html = async (req, res) => {

	try {
		let html = [];
		// GET: Video Service
		let {data} = await axios.get(`${config.videoServiceUrl}/anchor`);
		
		data.forEach(el => html.push( {"text": el.name, "value": el.name} ));	// Creating key-value structure for fastselect dropdown
		res.send(html);
	}
	catch (err) {
		console.error(err.code);
		res.send(err.code);
	}
}