function Pagination(model){
  return async(req,res,next)=>{
      let page = parseInt(req.query.page); 
      let limit = parseInt(req.query.limit);
      let startIndex = (page - 1) * limit ; 
      let endIndex = (page ) * limit ;
      // let pagination = {}; 

      try {

          let length = await model.count(); 

          let pagination = {
              results : {},
              next : null , 
              previous : null 
          }
          
          pagination.results = await model.find().skip(startIndex).limit(limit); 
          if(endIndex < length){
              pagination.next = true 
          }
          else{
              pagination.next = false ; 
          }
          if(startIndex > 0){
              pagination.previous = true 
          }
          else{
              pagination.previous = false ; 
          }
          req.pagination = pagination; 
          next(); 
    } catch (error) {
        res.status(500).json({success:false,msg:"Internal Server Error"})
    }
  }
}

module.exports = Pagination ;  