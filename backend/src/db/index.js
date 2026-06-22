import mongoose from "mongoose";

let connectDB = async ()=>{
    try{
        let connectionInstance =await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        console.log(`\n MongoDb connected!! DB Host : ${connectionInstance.connection.host}`)
    }catch(error){
        console.log("error at db connection: "+ error)
        process.exit(1)
    }
}

export default connectDB;