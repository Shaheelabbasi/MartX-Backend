const asyncHandler=(fn)=>{
         
        return  async (req,res)=>{
               
            try {
                await fn(req,res)
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