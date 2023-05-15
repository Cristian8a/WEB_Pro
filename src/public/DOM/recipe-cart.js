let cart = [];

let listaRecetas = document.getElementById("Cart");
let main= [];

async function loadCart() {
  sessionStorage.setItem('user','axel')
  let user =sessionStorage.getItem('user')

  console.log("el usuario es: ",user);

  let resp = await fetch("/api/recetas", {
    method: "GET",
    headers: {
      "x-token": "admin",
    },
  });

  cart = await resp.json();
  //console.log(JSON.stringify(cart));
  listaRecetas.innerHTML = cart
    .map(
      (rcp) => /*html*/ `
      <div class="media">
      <div class="media-body mr-3">
        <div class="input-group mt-2 mb-3">
          <h4 class="mx-2">${rcp.titulo}</h4>
          <div class="input-group-append">
            <a href="#" class="btn btn-danger" onclick="eliminarReceta('${rcp.uuid}')"><i
                class="fas fa-trash-alt remove"></i></a>
            <form class="form-inline my-2 my-lg-0">
                <button class="btn btn-dark my-2 my-sm-0" id="upload_${rcp.uuid}" type="submit"
                  onclick="uploadRecipe('${rcp.uuid}')">Subir receta</button>
              </form>
          </div>
        </div>
        <div class="input-group mb-3 w-75" id="dificultad_${rcp.uuid}">
          <div class="input-group-prepend">
            <span class="input-group-text">Dificultad: </span>
          </div>
          <input type="number" class="col-10 form-control bg-light" min="1" max="5" value="${rcp.dificultad}" disabled
            id="input_${rcp.uuid}">
          <div class="input-group-append">
            <div class="input-group-append">
              <a href="#" class="btn btn-info" id="editar" onclick="editarDif('${rcp.uuid}')"><i
                  class="fas fa-pencil-alt edit"></i></a>
              <a href="#" class="btn btn-success d-none" onclick="aceptarDif('${rcp.uuid}')" id="aceptar"><i
                  class="fas fa-check"></i><span class="sr-only">Aceptar</span></a>
              <a href="#" class="btn btn-danger d-none" onclick="cancelarDif('${rcp.uuid}')" id="cancelar"><i
                  class="fas fa-times"></i></a>
            </div>
          </div>
        </div>
        <div class="input-group mb-3" id="ingredientes_${rcp.uuid}">
          <div class="input-group-prepend">
            <span class="input-group-text pr-">Ingredientes: </span>
          </div>

          <textarea class="form-control" id="addTxt_${rcp.uuid}" disabled>${rcp.ingredientes}</textarea>

          <div class="input-group-append">
            <div class="input-group-append">
              <a href="#" class="btn btn-info" id="editar" onclick="editarIngr('${rcp.uuid}')"><i
                  class="fas fa-pencil-alt edit"></i></a>
              <a href="#" class="btn btn-success d-none" onclick="aceptarIngr('${rcp.uuid}')" id="aceptar"><i
                  class="fas fa-check"></i><span class="sr-only">Aceptar</span></a>
              <a href="#" class="btn btn-danger d-none" onclick="cancelarIngr('${rcp.uuid}')" id="cancelar"><i
                  class="fas fa-times"></i></a>
            </div>
          </div>
        </div>
        <div class="input-group mb-3" id="descripcion_${rcp.uuid}">
          <div class="input-group-prepend">
            <span class="input-group-text pr-">Descripcion: </span>
          </div>
          <textarea class="form-control" id="desTxt_${rcp.uuid}" disabled>${rcp.descripcion}</textarea>

          <div class="input-group-append">
            <div class="input-group-append">
              <a href="#" class="btn btn-info" id="editar" onclick="editarDes('${rcp.uuid}')"><i
                  class="fas fa-pencil-alt edit"></i></a>
              <a href="#" class="btn btn-success d-none" onclick="aceptarDes('${rcp.uuid}')" id="aceptar"><i
                  class="fas fa-check"></i><span class="sr-only">Aceptar</span></a>
              <a href="#" class="btn btn-danger d-none" onclick="cancelarDes('${rcp.uuid}')" id="cancelar"><i
                  class="fas fa-times"></i></a>
            </div>
          </div>
        </div>
        <div class="input-group mb-3 w-75" id="autor_${rcp.uuid}">
          <div class="input-group-prepend">
            <span class="input-group-text">Autor: </span>
          </div>
          <input type="text" class="col-10 form-control bg-light" value="${rcp.autor}" disabled id="auTxt_${rcp.uuid}">
          <div class="input-group-append">
            <div class="input-group-append">
              <a href="#" class="btn btn-info" id="editar" onclick="editarAut('${rcp.uuid}')"><i
                  class="fas fa-pencil-alt edit"></i></a>
              <a href="#" class="btn btn-success d-none" onclick="aceptarAut('${rcp.uuid}')" id="aceptar"><i
                  class="fas fa-check"></i><span class="sr-only">Aceptar</span></a>
              <a href="#" class="btn btn-danger d-none" onclick="cancelarAut('${rcp.uuid}')" id="cancelar"><i
                  class="fas fa-times"></i></a>
            </div>
          </div>
        </div>
      </div>
      <div class="media-right align-self-center">
        <img class="rounded" src=${rcp.imageUrl} alt=${rcp.descripcion} width="150" height="150">
      </div>
      
    </div>`
    )
    .join("");
}

loadCart();

async function eliminarReceta(uuid) {
  await fetch("/api/recetas/" + uuid, {
    method: "DELETE",
    headers: {
      "x-token": "admin",
    },
  });
  loadCart();
}
let savedInput = "";
let flag = false; //flag to check whether a new input is given or not

/* upload recipe */
async function uploadRecipe(uuid){
 
    event.preventDefault();
  
  let resp = await fetch("/api/recetas/"+uuid, {
    method: "GET",
    headers: {
      "x-token": "admin",
    },
  });

  main = await resp.json();

  console.log("elemetnos son: ",main);
  //console.log(JSON.stringify(cart));
  await fetch("/api/main/",{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": "admin",
    },
    body: JSON.stringify({
      "titulo": main.autor,
      "descripcion":main.descripcion,
      "dificultad": main.dificultad,
      "imageUrl": main.imageUrl,
      "ingredientes":main.ingredientes,
      "autor": main.autor
    }),
  });
}
/*  Edit buttons*/
function editarDif(uuid) {
  const parentDiv = document.getElementById(`dificultad_${uuid}`);
  //prevent the page to reaload automatically
  parentDiv.addEventListener("click", function (event) {
    event.preventDefault();
  });
  const editarBtn = parentDiv.querySelector("#editar");
  const aceptarBtn = parentDiv.querySelector("#aceptar");
  const cancelarBtn = parentDiv.querySelector("#cancelar");
  const input = document.getElementById(`input_${uuid}`)
  console.log("input value is: ",input.value);
  savedInput = input.value; //save input value

  //modify the class so that we can display the buttons
  editarBtn.classList.add("d-none");
  aceptarBtn.classList.remove("d-none");
  cancelarBtn.classList.remove("d-none");
  input.disabled=false;
  flag=true;
}

async function aceptarDif(uuid) {
  const dificultad = document.getElementById(`input_${uuid}`);

  const parentDiv = document.getElementById(`dificultad_${uuid}`);
  const editarBtn = parentDiv.querySelector("#editar");
  const aceptarBtn = parentDiv.querySelector("#aceptar");
  const cancelarBtn = parentDiv.querySelector("#cancelar");

  //modify the class so that we can display the buttons

  editarBtn.classList.remove("d-none");
  aceptarBtn.classList.add("d-none");
  cancelarBtn.classList.add("d-none");

  flag = true;
  dificultad.disabled=true;
  dificultad.value = dificultad.value;
  await fetch("/api/recetas/" + uuid, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-token": "admin",
    },
    body: JSON.stringify({
      "dificultad": dificultad.value,
    }),
  });

}

function cancelarDif(uuid) {
  flag=false;
  const parentDiv = document.getElementById(`dificultad_${uuid}`);
  //prevent the page to reaload automatically
  parentDiv.addEventListener("click", function (event) {
    event.preventDefault();
  });
  const editarBtn = parentDiv.querySelector("#editar");
  const aceptarBtn = parentDiv.querySelector("#aceptar");
  const cancelarBtn = parentDiv.querySelector("#cancelar");
  //modify the class so that we can display the buttons
  editarBtn.classList.remove("d-none");
  aceptarBtn.classList.add("d-none");
  cancelarBtn.classList.add("d-none");
  const input = document.getElementById(`input_${uuid}`)
  if (flag == false) {
    //since we do not have a new input at all, we can set/keep the original value
    
    input.disabled=true;
    input.value = savedInput;
  }
}

function editarIngr(uuid) {
  const parentDiv = document.getElementById(`ingredientes_${uuid}`);
  //prevent the page to reaload automatically
  parentDiv.addEventListener("click", function (event) {
    event.preventDefault();
  });
  const editarBtn = parentDiv.querySelector("#editar");
  const aceptarBtn = parentDiv.querySelector("#aceptar");
  const cancelarBtn = parentDiv.querySelector("#cancelar");
  const input = document.getElementById(`addTxt_${uuid}`);
  savedInput = input.value; //save input value

  //modify the class so that we can display the buttons
  editarBtn.classList.add("d-none");
  aceptarBtn.classList.remove("d-none");
  cancelarBtn.classList.remove("d-none");
  input.disabled = false;
}

async function aceptarIngr(uuid) {
  const ingrTxt = document.getElementById(`addTxt_${uuid}`);
  console.log("ingredientes: ", ingrTxt.value);

  const parentDiv = document.getElementById(`ingredientes_${uuid}`);
  const editarBtn = parentDiv.querySelector("#editar");
  const aceptarBtn = parentDiv.querySelector("#aceptar");
  const cancelarBtn = parentDiv.querySelector("#cancelar");
  //modify the class so that we can display the buttons

  editarBtn.classList.remove("d-none");
  aceptarBtn.classList.add("d-none");
  cancelarBtn.classList.add("d-none");

  flag = true;
  ingrTxt.disabled = true;
  ingrTxt= ingrTxt;
  await fetch("/api/recetas/" + uuid, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-token": "admin",
    },
    body: JSON.stringify({
      ingredientes: ingrTxt.value,
    }),
  });

}

function cancelarIngr(uuid) {
  flag=false;
  const parentDiv = document.getElementById(`ingredientes_${uuid}`);

  //prevent the page to reaload automatically
  parentDiv.addEventListener("click", function (event) {
    event.preventDefault();
  });
  const editarBtn = parentDiv.querySelector("#editar");
  const aceptarBtn = parentDiv.querySelector("#aceptar");
  const cancelarBtn = parentDiv.querySelector("#cancelar");
  //modify the class so that we can display the buttons

  editarBtn.classList.remove("d-none");
  aceptarBtn.classList.add("d-none");
  cancelarBtn.classList.add("d-none");
  if (flag == false) {
    //since we do not have a new input at all, we can set/keep the original value
    const input = document.getElementById(`addTxt_${uuid}`);
    input.disabled = true;
    input.value = savedInput;
  }
}

function editarDes(uuid) {
  const parentDiv = document.getElementById(`descripcion_${uuid}`);
  //prevent the page to reaload automatically
  parentDiv.addEventListener("click", function (event) {
    event.preventDefault();
  });
  const editarBtn = parentDiv.querySelector("#editar");
  const aceptarBtn = parentDiv.querySelector("#aceptar");
  const cancelarBtn = parentDiv.querySelector("#cancelar");
  const input = document.getElementById(`desTxt_${uuid}`);
  savedInput = input.value; //save input value

  //modify the class so that we can display the buttons
  editarBtn.classList.add("d-none");
  aceptarBtn.classList.remove("d-none");
  cancelarBtn.classList.remove("d-none");
  input.disabled = false;
}

async function aceptarDes(uuid) {
  const desTxt = document.getElementById(`desTxt_${uuid}`);
  console.log("descripcion: ", desTxt);

  const parentDiv = document.getElementById(`descripcion_${uuid}`);
  const editarBtn = parentDiv.querySelector("#editar");
  const aceptarBtn = parentDiv.querySelector("#aceptar");
  const cancelarBtn = parentDiv.querySelector("#cancelar");
  //modify the class so that we can display the buttons

  editarBtn.classList.remove("d-none");
  aceptarBtn.classList.add("d-none");
  cancelarBtn.classList.add("d-none");

  flag = true;
  desTxt.disabled = true;
  desTxt.value = desTxt;
  await fetch("/api/recetas/" + uuid, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-token": "admin",
    },
    body: JSON.stringify({
      descripcion: desTxt.value,
    }),
  });

}

function cancelarDes(uuid) {
  flag=false;
  const parentDiv = document.getElementById(`descripcion_${uuid}`);

  //prevent the page to reaload automatically
  parentDiv.addEventListener("click", function (event) {
    event.preventDefault();
  });
  const editarBtn = parentDiv.querySelector("#editar");
  const aceptarBtn = parentDiv.querySelector("#aceptar");
  const cancelarBtn = parentDiv.querySelector("#cancelar");
  //modify the class so that we can display the buttons

  editarBtn.classList.remove("d-none");
  aceptarBtn.classList.add("d-none");
  cancelarBtn.classList.add("d-none");
  if (flag == false) {
    //since we do not have a new input at all, we can set/keep the original value
    const input = document.getElementById(`desTxt_${uuid}`);
    input.disabled = true;
    input.value = savedInput;
  }
}

function editarAut(uuid) {
  const parentDiv = document.getElementById(`autor_${uuid}`);
  //prevent the page to reaload automatically
  parentDiv.addEventListener("click", function (event) {
    event.preventDefault();
  });
  const editarBtn = parentDiv.querySelector("#editar");
  const aceptarBtn = parentDiv.querySelector("#aceptar");
  const cancelarBtn = parentDiv.querySelector("#cancelar");
  const input = document.getElementById(`auTxt_${uuid}`)
  console.log("input value is: ",input.value);
  savedInput = input.value; //save input value

  //modify the class so that we can display the buttons
  editarBtn.classList.add("d-none");
  aceptarBtn.classList.remove("d-none");
  cancelarBtn.classList.remove("d-none");
  input.disabled=false;
  flag=true;
}

async function aceptarAut(uuid) {
  const autor = document.getElementById(`auTxt_${uuid}`);

  const parentDiv = document.getElementById(`autor_${uuid}`);
  const editarBtn = parentDiv.querySelector("#editar");
  const aceptarBtn = parentDiv.querySelector("#aceptar");
  const cancelarBtn = parentDiv.querySelector("#cancelar");

  //modify the class so that we can display the buttons

  editarBtn.classList.remove("d-none");
  aceptarBtn.classList.add("d-none");
  cancelarBtn.classList.add("d-none");

  flag = true;
  autor.disabled=true;
  autor.value = autor.value;
  await fetch("/api/recetas/" + uuid, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-token": "admin",
    },
    body: JSON.stringify({
      "autor": autor.value,
    }),
  });

}

function cancelarAut(uuid) {
  flag=false;
  const parentDiv = document.getElementById(`autor_${uuid}`);
  //prevent the page to reaload automatically
  parentDiv.addEventListener("click", function (event) {
    event.preventDefault();
  });
  const editarBtn = parentDiv.querySelector("#editar");
  const aceptarBtn = parentDiv.querySelector("#aceptar");
  const cancelarBtn = parentDiv.querySelector("#cancelar");
  //modify the class so that we can display the buttons
  editarBtn.classList.remove("d-none");
  aceptarBtn.classList.add("d-none");
  cancelarBtn.classList.add("d-none");
  const input = document.getElementById(`auTxt_${uuid}`)
  if (flag == false) {
    //since we do not have a new input at all, we can set/keep the original value
    
    input.disabled=true;
    input.value = savedInput;
  }
}
