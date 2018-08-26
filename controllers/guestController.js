const axios = require('axios');
const config = require('../config/config');

exports.get = async (req, res) => {
	
	let resp = await axios.get(`${config.videoServiceUrl}/guest`);
	let list = resp.data;

	res.render('guest', {title: 'Video', list});
}

exports.add = async (req, res) => {

	let postData = req.body;
	console.log(postData);

	let resp = await axios.post(`${config.videoServiceUrl}/guest`, postData);
	resp = resp.data;
	console.log(resp);
	
	res.redirect('/guest');
}

exports.update = async (req, res) => {

	let { _id } = req.query;
	let postData = req.body;
	console.log(postData);

	let resp = await axios.put(`${config.videoServiceUrl}/guest?_id=${_id}`, postData);
	resp = resp.data;
	console.log(resp);
	
	res.send("Updated!");
}

exports.editable = async (req, res) => {

	const postData = req.body;
	console.log(postData);

	const { name, value, pk } = postData;
	console.log(name, value, pk);

	let resp = await axios.put(`${config.videoServiceUrl}/guest?_id=${pk}`, {[name]: value});
	resp = resp.data;
	console.log(resp);
	
	res.send("Updated!");
}

exports.delete = async (req, res) => {

	const { _id } = req.query;
	let resp = await axios.delete(`${config.videoServiceUrl}/guest?_id=${_id}`);
	res.send('Deleted!');
}

// API CALLS -----------------------------------
exports.html = async (req, res) => {

    let resp = await axios.get(`${config.videoServiceUrl}/guest`);
	resp = resp.data;
    // console.log(resp);
    
    let html = [];
    resp.forEach(el => html.push( {"text": el.name, "value": el.name} ));
    // console.log(catsHtml);
    res.send(html);
}

exports.weightage = async (req, res) => {

    let resp = [
		{name: '1'},
		{name: '2'},
		{name: '3'},
		{name: '4'},
		{name: '5'},
		{name: '6'},
		{name: '7'},
		{name: '8'},
		{name: '9'},
		{name: '10'},
	]
    
    let html = [];
    resp.forEach(el => html.push( {"text": el.name, "value": el.name} ));
    // console.log(catsHtml);
    res.send(html);
}