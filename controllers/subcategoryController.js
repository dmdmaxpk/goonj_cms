// NOTE: All code related to sub category is commented just in case, can be removed totally in future if not required

const axios = require('axios');
const config = require('../config/config');

// Main Category page
exports.get_cats = async (req, res) => {
	
	try {
		// GET: Video Service
        let {data} = await axios.get(`${config.videoServiceUrl}/subcat`);
        console.log(data)
		res.render('subcategory_main', {title: 'SubCategory', data});		// Rendering the cateogory_main view and passing the categories list
	}
	catch (err) {
		console.error(err.code);
		res.send(err.code);
	}
}

exports.get_drama_cats = async (req, res) => {
	try{
		let dramas = [];
		// let {data} = await axios.get(`https://api.goonj.pk/v2/subcategory?category_name=drama`);
		let {data} = await axios.get(`${config.videoServiceUrl}/subcat?category_name=drama`);
		data.forEach(el => dramas.push( {"text": el.name, "value": el.name} ));	// Creating key-value structure for fastselect dropdown
		res.send(dramas);
	} catch (err) {
		console.log(err);
		res.sebd(err);
	}
}

// Add Sub-Category
// exports.subcats_of_cat = async (req, res) => {
	
// 	let { cat_id } = req.params;
	
// 	let resp = await axios.get(`${config.videoServiceUrl}/category?cat_id=${cat_id}`);
// 	let category = resp.data;
// 	let subcatList = category.sub_categories;

// 	res.render('category_sub', {title: 'Category', category, subcatList});
// }

// Add Category
exports.add_cat = async (req, res) => {

	let postData = req.body;
	console.log(postData);

	try{
		// POST: Video Service
		let {data} = await axios.post(`${config.videoServiceUrl}/subcat`, postData);
		console.log(data);
	}
	catch (err) {
		console.error(err.code);
		res.send(err.code);
	}
	
	res.redirect('/subcategory');		// Redirecting to main page
}

// Add Sub-cat
// exports.add_subcat = async (req, res) => {

// 	let { cat_id } = req.query;
// 	let postData = req.body;
// 	console.log(postData);

// 	let resp = await axios.post(`${config.videoServiceUrl}/category?cat_id=${cat_id}`, postData);
// 	resp = resp.data;
// 	console.log(resp);
	
// 	res.redirect(`/category/${cat_id}`);
// }

// Delete Category
exports.delete = async (req, res) => {

	const { cat_id, subcat_id} = req.query;

	try {
		// DELETE: Video Service
		let {data} = await axios.delete(`${config.videoServiceUrl}/subcat?cat_id=${cat_id}&subcat_id=${subcat_id}`);
		res.send(data);
	}
	catch (err) {
		console.error(err.code);
		res.send(err.code);
	}
}

// For fastSelect HTML, which is used on video page
exports.html_cats = async (req, res) => {

	try {
		let catsHtml = [];
		// GET: Video Service
		let {data} = await axios.get(`${config.videoServiceUrl}/subcat`);
		
		data.forEach(el => catsHtml.push( {"text": el.name, "value": el.name} ));	// Creating key-value structure for fastselect dropdown
		res.send(catsHtml);
	}
	catch (err) {
		console.error(err.code);
		res.send(err.code);
	}
}

// For fastSelect HTML, which is used on video page
// exports.html_subcats = async (req, res) => {

// 	const { cat_name } = req.query;

// 	let resp = await axios.get(`${config.videoServiceUrl}/category?cat_name=${cat_name}`);
// 	let result = resp.data.sub_categories;
//     res.send(result);
// }