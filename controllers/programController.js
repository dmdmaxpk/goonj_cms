const axios = require('axios');
const config = require('../config/config');

exports.get = async (req, res) => {
	
	let resp = await axios.get(`${config.videoServiceUrl}/program`);
	let list = resp.data;

	res.render('program', {title: 'Video', list});
}

exports.add = async (req, res) => {

	let postData = req.body;
	postData.name = postData.name.trim();
	console.log(postData);

	let resp = await axios.post(`${config.videoServiceUrl}/program`, postData);
	resp = resp.data;
	console.log(resp);
	
	res.redirect('/program');
}

exports.editable = async (req, res) => {

	const postData = req.body;
	console.log(postData);

	const { name, value, pk } = postData;
	console.log(name, value, pk);

	let resp = await axios.put(`${config.videoServiceUrl}/program?_id=${pk}`, {[name]: value});
	resp = resp.data;
	console.log(resp);
	
	res.send("Updated!");
}

exports.delete = async (req, res) => {

	const { _id } = req.query;
	let resp = await axios.delete(`${config.videoServiceUrl}/program?_id=${_id}`);
	res.send('Deleted!');
}

// API CALLS -----------------------------------
exports.html = async (req, res) => {

    let resp = await axios.get(`${config.videoServiceUrl}/program`);
	resp = resp.data;
    // console.log(resp);
    
    let html = [];
    resp.forEach(el => html.push( {"text": el.name, "value": el.name} ));
    // console.log(catsHtml);
    res.send(html);
}

