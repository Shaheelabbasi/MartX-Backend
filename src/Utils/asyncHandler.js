const asyncHandler=(fn)=>{
         
        return  async (req,res,next)=>{
               
            try {
                // next is necessary here when we cal midddlewares
                await fn(req,res,next)
            } catch (error) {
                console.log(error)

                res.status(error.statuscode || 500).json({

                    success:false,
                    message:error.message
                    
                }
                )
            }


        }

}

export {asyncHandler}