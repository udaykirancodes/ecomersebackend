function Pagination(model){
  return async(req,res,next)=>{
      let page = parseInt(req.query.page); 
      let limit = parseInt(req.query.limit);
      let startIndex = (page - 1) * limit ; 
      let endIndex = (page ) * limit - 1;

      console.log(startIndex , endIndex); 
      // find by category 
      let category = req.query.category; 

      // let pagination = {}; 
      let search = req.query.search; 

      let query = {}; 

      try {
        //   let length = await model.count(); 
          let pagination = {
              results : {},
              next : null , 
              previous : null 
          }
          // searching 
          if(req.query.search){
                query = {
                    $or:[
                        {"name":{$regex:`${search}` , $options:'i'}},
                        {"category":{$regex:`${search}` , $options:'i'}},
                    ]
                }
                console.log(req.query.search); 
          }
          if(req.query.category){
            query = {subCategory :  { "$in" : [req.query.category]} }
          }
         
          pagination.results = await model.find(query).skip(startIndex).limit(limit); 
          
          let length = await model.countDocuments() // length 

          console.log(endIndex,length)
          pagination.current = page; 
          
          if(endIndex < length-1){
              pagination.next = page + 1; 
          }
          if(startIndex > 0){
              pagination.previous = page - 1;   
          }
          pagination.pages = length/limit ; 
          req.pagination = pagination; 
          next(); 
    } catch (error) {
        res.status(500).json({success:false,msg:"Internal Server Error",error:error.message})
    }
  }
}

module.exports = Pagination ;  