const router = require("express").Router();
const { validarBody,authStrict } = require("../middlewares/recipes.js");
const { Receipt } = require("../db/recetas.js");
const nanoid = require("nanoid");

//get by id
router.get('/:id',authStrict, async (req, res) => {
  console.log('El id es:',req.params.id);
  let receipts = await Receipt.getReceiptByID(req.params.id);
  if(receipts){
    console.log("encontrado");
    res.send(receipts);
  }else{
    console.log('no encontrado');
    res.status(404).send('no encontrado')
  }
});
//get all
router.get('/',authStrict, async (req,res)=>{
  let filtro = {}
  let {titulo, descripcion, ingredientes,dificultad,imageUrl,autor} = req.query;
  
  if(titulo) {
      filtro.titulo = new RegExp(titulo,'i'); //i = ignore case
  }
  if(descripcion) {
      filtro.descripcion = new RegExp(descripcion,'i'); 
  }
  if(ingredientes) {
      filtro.ingredientes = new RegExp(ingredientes,'i'); 
  }
  if(dificultad) {
      filtro.dificultad = new RegExp(dificultad,'i'); 
  }
  if(imageUrl) {
    filtro.imageUrl = new RegExp(imageUrl,'i'); 
}
  if(autor) {
    filtro.autor = new RegExp(autor,'i'); 
}
  
  let recetas = await Receipt.getReceipts(filtro)
  res.send(recetas)
})

//post
router.post('/', validarBody,authStrict, async (req, res) => {
  let {titulo, descripcion, dificultad, ingredientes,imageUrl,autor } = req.body;
  console.log('uuid generated:',nanoid.nanoid());
  let newDoc = await Receipt.createReceipt({
    uuid: nanoid.nanoid(),
    titulo,
    descripcion,
    dificultad,
    ingredientes,
    imageUrl,
    autor
  });
  res.status(201).send(newDoc);
});
//put by id
router.put('/:id',authStrict, async(req,res)=>{
  let newData={};
  let {titulo, descripcion, dificultad, ingredientes,imageUrl,autor} = req.body;
  let toUpdate = await Receipt.getReceiptByID(req.params.id);
  let newDoc;

  if(toUpdate){
    if(titulo) newData.titulo=titulo;
    if(descripcion) newData.descripcion=descripcion;
    if(dificultad) newData.dificultad=dificultad;
    if(imageUrl) newData.imageUrl=imageUrl;
    if(ingredientes) newData.ingredientes=ingredientes;
    if(autor) newData.autor=autor;
    
    newDoc= await Receipt.updateReceipt(req.params.id,newData);
  }else{
    res.status(404).send({error: "Recipe uuid not found"})
  }

  res.status(201).send(newDoc);
})
//delete
router.delete('/:id',authStrict, async (req, res) => {
  try {
    const id = req.params.id;
    await Receipt.deleteReceipt(id);
    res.send(`Recipe with UID ${id} has been deleted.`);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while deleting the recipe.");
  }
});

module.exports = router;
