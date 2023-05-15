const { mongo } = require('mongoose');
const {mongoose} = require('./connectDB.js');

const favoritesSchema = mongoose.Schema({
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

favoritesSchema.statics.getReceipts = async(filtros)=>{
    let docs = await Favorites.find(filtros)
    console.log(docs);
    return docs;
}

favoritesSchema.statics.getReceiptByID= async(uuid) => {
    let doc = await Favorites.findOne({uuid})
    console.log(doc);
    return doc
}

favoritesSchema.statics.createReceipt = async(data)=>{
    let newReceipt = Favorites(data)
    return await newReceipt.save()
}

favoritesSchema.statics.updateReceipt = async(uuid, data)=>{
    let updated = await Favorites.findOneAndUpdate({uuid},{$set: data},{new:true})
    return updated;
}

favoritesSchema.statics.deleteReceipt= async(uuid) => {
    let doc = await Favorites.findOneAndDelete({uuid})
    console.log(doc);
    return doc
}

const Favorites  = mongoose.model('Favorites', favoritesSchema);
module.exports={Favorites};