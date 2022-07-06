const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const multer  = require('multer')
const mongoose = require('mongoose')
// importing blog model 
const Blogs = require('../../models/Blog');

// importing middleware 
const FetchAdmin = require('../../middlewares/FetchAdmin'); 
const Categories = require('../../models/Categories');
const Blog = require('../../models/Blog');
const Pagination = require('../../middlewares/Pagination');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/blogs/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now().toString()+ '_'+file.originalname)
    }
})

const upload = multer({ storage : storage })

// get categories of blgos 
router.get('/categories',async (req,res)=>{
    try {
        let all = await Categories.findOne().select("blogs"); 
        let {blogs} = all 
        res.status(200).json({success:true,data:blogs}); 
    } catch (error) {
        return res.status(500).json({success:false,msg:"Internal Server Error"}); 
    }
})

// Add a Blog :  
router.post('/add',
FetchAdmin, 
upload.single('image'),
async(req,res)=>{
    
    const {title , description } = req.body; 
    if(!title || !description || !req.file){
        return res.status(400).json({success:false,msg:"All Fileds are Required"}); 
    }

    try {

        let blog = new Blogs({
            title:req.body.title , 
            description:req.body.description,
            img : req.file.path , 
            isDeleted:false ,
            category:req.body.category  // array
        })

        // add categories to the categories section
        let allCategories = await Categories.findOne(); 

        // first time create model if there is no data 
        if(!allCategories){
            console.log('categories not found')
            let a = new Categories({
                blogs: req.body.category
            })
            await a.save(); 
        }
        // if we have the data then add new categories 
        else{
            let {category} = req.body;
            console.log(category); 
            // return ; 
            let newCategories = []; 

            // let aCategory = JSON.parse(category); 

            category.forEach(element => {
                if(!allCategories.blogs.includes(element)){
                     newCategories.push(element); 
                }
            });
            
            await Categories.updateOne( { $addToSet: { blogs: { $each: newCategories } } });
            // await Categories.updateOne({$pushAll: {blogs:['google','fb']}},{upsert:true});
            
        }

        let newblog = await blog.save(); 
        res.status(200).json({success:true , blog:newblog}); 
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,msg:'Internal Server Error'});
    }
})

// Get By Blogs by category :  
router.get('/getall', Pagination(Blog), 
async(req,res)=>{

    try {
        if(req.query.category==='' && req.query.page===''){
            const blogs = await Blog.find(); 
            return res.status(200).json({success:true , data : blogs})
        }
        
        res.status(200).json({success:true , data:req.pagination}); 
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,msg:'Internal Server Error'});
    }
})
// Get Single Blog by Id ;   
router.get('/:id',
async(req,res)=>{
    try {
        let blog = null ; 
        if(!mongoose.isValidObjectId(req.params.id)){
            return res.status(400).json({success:false,msg:"Invalid Object"}); 
        }

        blog = await Blog.findById(req.params.id); 
        if(!blog){
            return res.status(400).json({success:false,msg:"Blog Not Found"}); 
        }
        return res.status(200).json({success:true,data:blog})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,msg:'Internal Server Error'});
    }
})
// Edit a Blog :  
router.put('/edit',
FetchAdmin, 
upload.single('image'),
async(req,res)=>{
    try {
        // checking if id exists 
        const id = req.body.id ;
        if(!id){
            return res.status(200).json({success:false,msg:"Id Needed"}); 
        } 
        // finding blog with the blog 
        let blog = await Blogs.findByIdAndUpdate(id); 
        if(!blog){
            return res.status(200).json({success:false,msg:"Cannot find a blog"}); 
        }

        const {title , description } = req.body ; 
        
        if(title){
            blog.title = title ; 
        }
        if(description){
            blog.description = description
        }
        if(req.file){
            blog.img = req.file.path ; 
        }

        let updatedBlog = await blog.save(); 

        res.status(200).json({success:true,data:updatedBlog}); 

    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,msg:'Internal Server Error'});
    }
})
// Delete a Blog :  
router.put('/delete',
FetchAdmin , 
async(req,res)=>{

    try {
        // checking if id exists 
        const id = req.body.id ;
        if(!id){
            return res.status(200).json({success:false,msg:"Id Needed"}); 
        } 
        // finding blog with the blog 
        let blog = await Blogs.findByIdAndUpdate(id);
        if(!blog){
            return res.status(200).json({success:false,msg:"cannot find a blog"}); 
        }
        blog.isDeleted = true   
        let newblog = await blog.save(); 
        res.status(200).json({success:true,data:"blog is deleted"});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,msg:'Internal Server Error'});
    }
})


// Delete a Blog :  
router.delete('/delete',
FetchAdmin , 
async(req,res)=>{
    try {
        // checking if id exists 
        const id = req.body.id ;
        if(!id){
            return res.status(200).json({success:false,msg:"Id Needed"}); 
        } 

        // finding blog with the blog 
        let blog = await Blogs.findByIdAndDelete(id);
        if(!blog){
            return res.status(400).json({success:false,msg:"cannot find a blog"}); 
        }
        res.status(200).json({success:true,data:"Blog is Deleted"});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,msg:'Internal Server Error'});
    }
})
// Undo Delete a Blog :  
router.put('/undo',
FetchAdmin , 
async(req,res)=>{

    try {
        // checking if id exists 
        const id = req.body.id ;
        if(!id){
            return res.status(200).json({success:false,msg:"Id Needed"}); 
        } 

        // finding blog with the blog 
        let blog = await Blogs.findByIdAndUpdate(id);
        if(!blog){
            return res.status(400).json({success:false,msg:"cannot find a blog"}); 
        }

        if(!blog.isDeleted){
            return res.status(400).json({success:false,msg:"Blog is Not Deleted"})
        }
        blog.isDeleted = false    
        let newblog = await blog.save(); 
        res.status(200).json({success:true,data:"blog is retrived again"});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,msg:'Internal Server Error'});
    }
})
module.exports = router; 