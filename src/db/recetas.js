const { mongo } = require('mongoose');
const {mongoose} = require('./connectDB.js');

const receiptSchema = mongoose.Schema({
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

receiptSchema.statics.getReceipts = async(filtros)=>{
    let docs = await Receipt.find(filtros)
    console.log(docs);
    return docs;
}

receiptSchema.statics.getReceiptByID= async(uuid) => {
    let doc = await Receipt.findOne({uuid})
    console.log(doc);
    return doc
}

receiptSchema.statics.createReceipt = async(data)=>{
    let newReceipt = Receipt(data)
    return await newReceipt.save()
}

receiptSchema.statics.updateReceipt = async(uuid, data)=>{
    let updated = await Receipt.findOneAndUpdate({uuid},{$set: data},{new:true})
    return updated;
}

receiptSchema.statics.deleteReceipt= async(uuid) => {
    let doc = await Receipt.findOneAndDelete({uuid})
    console.log(doc);
    return doc
}

const Receipt  = mongoose.model('Receipt', receiptSchema);
module.exports={Receipt};