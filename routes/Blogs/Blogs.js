const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const multer  = require('multer')

// importing blog model 
const Blogs = require('../../models/Blog');

// importing middleware 
const FetchAdmin = require('../../middlewares/FetchAdmin'); 


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/blogs/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now().toString()+ '_'+file.originalname)
    }
})

const upload = multer({ storage : storage })



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
            img : req.file.path  
        })

        let newblog = await blog.save(); 
        res.status(200).json({success:false , data:newblog}); 
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,msg:'Internal Server Error'});
    }
})
// Get All Blogs :  
router.get('/getall',
async(req,res)=>{

    try {
        let blogs = await Blogs.find(); 
        if(blogs){
            res.status(200).json({success:false , data:blogs}); 
        }
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
            return res.status(200).json({success:false,msg:"cannot find a blog"}); 
        }
        res.status(200).json({success:true,data:"blog is deleted"});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,msg:'Internal Server Error'});
    }
})
module.exports = router; 