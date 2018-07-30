const axios = require('axios');


exports.get_cats = async (req, res) => {
	
	let resp = await axios.get(`http://localhost:3000/category`);
	let categoryList = resp.data;

	res.render('category_main', {title: 'Video', categoryList});
}

exports.subcats_of_cat = async (req, res) => {
	
	let { cat_id } = req.params;
	
	let resp = await axios.get(`http://localhost:3000/category?cat_id=${cat_id}`);
	let category = resp.data;
	let subcatList = category.sub_categories;

	res.render('category_sub', {title: 'Video', category, subcatList});
}

exports.add_cat = async (req, res) => {

	let postData = req.body;
	console.log(postData);

	let resp = await axios.post(`http://localhost:3000/category`, postData);
	resp = resp.data;
	console.log(resp);
	
	res.redirect('/category');
}

exports.add_subcat = async (req, res) => {

	let { cat_id } = req.query;
	let postData = req.body;
	console.log(postData);

	let resp = await axios.post(`http://localhost:3000/category?cat_id=${cat_id}`, postData);
	resp = resp.data;
	console.log(resp);
	
	res.redirect(`/category/${cat_id}`);
}

exports.delete = async (req, res) => {

	const { cat_id, subcat_id} = req.query;
	let resp = await axios.delete(`http://localhost:3000/category?cat_id=${cat_id}&subcat_id=${subcat_id}`);
	res.send('Deleted!');
}

// API CALLS -----------------------------------
exports.html_cats = async (req, res) => {

    let resp = await axios.get(`http://localhost:3000/category`);
	let categories = resp.data;
    console.log(categories);
    
    let catsHtml = [];
    categories.forEach(el => catsHtml.push( {"text": el.name, "value": el.name} ));
    // console.log(catsHtml);
    res.send(catsHtml);
}

exports.html_subcats = async (req, res) => {

	const { cat_name } = req.query;

	let resp = await axios.get(`http://localhost:3000/category?cat_name=${cat_name}`);
	let result = resp.data.sub_categories;
    console.log(result);
    res.send(result);
}









	
