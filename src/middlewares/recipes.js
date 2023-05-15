function validarBody(req, res, next) {
    //validar que tenga todos los atributos
    let {titulo, descripcion, ingredientes, dificultad,imageUrl} = req.body;
    if(titulo && descripcion && ingredientes && imageUrl && dificultad!==undefined) {
        next();
        return; 
    }  

    res.status(400).send({error: "Faltan atributos, favor de revisar"})
}

function authStrict(req, res,next){
    let header = req.get("x-token")
    if(header){
        if(header == "admin"){
            next()
        }else{
            res.status(401).send({error: "No eres administrador"})
        }
    }else{
        res.status(403).send({error: " Faltan permisos, no tienes token"})
    }
}

module.exports = {validarBody, authStrict}