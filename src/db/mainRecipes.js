const { mongo } = require('mongoose');
const {mongoose} = require('./connectDB');

const mainSchema = mongoose.Schema({
    uuid: {
        type: String,
        unique: true,
        required: true,
    },
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    dificultad: {
        type: Number,
        required: true
    },
    ingredientes:{
        type: String,
        required: true
    },
    imageUrl:{
        type: String,
        required: true
    },
    autor:{
        type: String,
        required: true
    }
})
mainSchema.statics.getReceipts = async(filtros)=>{
    let docs = await MainRecipe.find(filtros)
    console.log(docs);
    return docs;
}

mainSchema.statics.getReceiptByID= async(uuid) => {
    let doc = await MainRecipe.findOne({uuid})
    console.log(doc);
    return doc
}

mainSchema.statics.createReceipt = async(data)=>{
    let newReceipt = MainRecipe(data)
    return await newReceipt.save()
}

mainSchema.statics.updateReceipt = async(uuid, data)=>{
    let updated = await MainRecipe.findOneAndUpdate({uuid},{$set: data},{new:true})
    return updated;
}

mainSchema.statics.deleteReceipt= async(uuid) => {
    let doc = await MainRecipe.findOneAndDelete({uuid})
    console.log(doc);
    return doc
}

const MainRecipe  = mongoose.model('MainRecipe', mainSchema);
module.exports={MainRecipe};