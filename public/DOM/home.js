let cart = [];
let fav= [];
let MyRecipe=[]
let listaRecetas = document.getElementById("home_recipes");

async function loadMain() {
  let resp = await fetch("/api/main", {
    method: "GET",
    headers: {
      "x-token": "admin",
    },
  });

  cart = await resp.json();
  //console.log(JSON.stringify(cart));

    //pagination
    let page = 1;
    if(!sessionStorage.getItem("page")){
        sessionStorage.setItem("page", page);
    }
    else{
        page = sessionStorage.getItem("page");
    }

    let numOfPages = Math.ceil(cart.length/4);
    let ulPages = document.getElementById("pages");
    let html = "";


    for(let i = 1; i <= numOfPages; i++){
        if(i != page){
            html += /* html*/`<li class="page-item pagination"><a class="page-link badge-light" id="pagination" href="#" onclick="setPage(${i})">${i}</a></li>`
        }
        else{
            html +=  /* html*/`<li class="page-item bg-dark active pagination"><a class="page-link bg-dark badge-dark" id="pagination" href="#" onclick="setPage(${i})">${i}</a></li>`
        }
    }

    ulPages.innerHTML = html;
    
    cart = cart.slice((page-1)*4, page*4);

    listaRecetas.innerHTML = cart
    .map(
      (rcp) => /*html*/ `
      <li class="col-12 col-md-6 col-lg-3">
      <div class="cnt-block equal-hight" style="height: 349px;">
        <figure><img
            src=${rcp.imageUrl}
            class="img-responsive" alt=""></figure>
        <h3><a href="">${rcp.titulo}</a></h3>
        <div class="creador">
          <p>${rcp.autor}: Dificultad: ${rcp.dificultad}</p>
        </div>
        <ul class="follow-us clearfix">
          <li><a href="#"><i class="fas fa-heart fa-lg" onclick="addFav('${rcp.uuid}')" style="color: #757575;" onmouseover="this.style.color='#FFA500'" onmouseout="this.style.color='#757575'" title="Añadir a Favoritos"></i></a></li>
          <li><a href="#"><i class="fas fa-tag fa-lg"  onclick="addMyRecipe('${rcp.uuid}')" style="color: #757575;" onmouseover="this.style.color='#FFA500'" onmouseout="this.style.color='#757575'" title="Añadir a Mis Recetas"></i></a></li>
        </ul>
      </div>
    </li>
      `
      )
    .join("");
}
function setPage(nPage){
  event.preventDefault();
  sessionStorage.setItem('page', nPage);
  loadMain();
}

loadMain();

//ADD BUTTONS
async function addFav(uuid) {
  event.preventDefault();
  
  let resp = await fetch("/api/main/"+uuid, {
    method: "GET",
    headers: {
      "x-token": "admin",
    },
  });

  fav = await resp.json();

  console.log("elemetnos son: ",fav);
  //console.log(JSON.stringify(cart));
  await fetch("/api/favorites/",{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": "admin",
    },
    body: JSON.stringify({
      "titulo": fav.autor,
      "descripcion":fav.descripcion,
      "dificultad": fav.dificultad,
      "imageUrl": fav.imageUrl,
      "ingredientes":fav.ingredientes,
      "autor": fav.autor
    }),
  });
}

async function addMyRecipe(uuid) {
  event.preventDefault();
  
  let resp = await fetch("/api/main/"+uuid, {
    method: "GET",
    headers: {
      "x-token": "admin",
    },
  });

  MyRecipe = await resp.json();

  console.log("elemetnos son: ",MyRecipe);
  //console.log(JSON.stringify(cart));
  await fetch("/api/recetas/",{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": "admin",
    },
    body: JSON.stringify({
      "titulo": MyRecipe.autor,
      "descripcion":MyRecipe.descripcion,
      "dificultad": MyRecipe.dificultad,
      "imageUrl": MyRecipe.imageUrl,
      "ingredientes":MyRecipe.ingredientes,
      "autor": MyRecipe.autor
    }),
  });
}

async function cancelar(){
  event.preventDefault();
  let button = document.getElementById('cancelar_filtro')
  button.classList.add("d-none");
  let recipes=[];
  let resp = await fetch("/api/main", {
    method: "GET",
    headers: {
      "x-token": "admin",
    },
  });

  recipes= await resp.json();
  //pagination
  let page = 1;
  if(!sessionStorage.getItem("page")){
      sessionStorage.setItem("page", page);
  }
  else{
      page = sessionStorage.getItem("page");
  }

  let numOfPages = Math.ceil(cart.length/4);
  let ulPages = document.getElementById("pages");
  let html = "";


  for(let i = 1; i <= numOfPages; i++){
      if(i != page){
          html +=  /* html*/`<li class="page-item pagination"><a class="page-link badge-light" id="pagination" href="#" onclick="setPage(${i})">${i}</a></li>`
      }
      else{
          html +=  /* html*/`<li class="page-item bg-dark active pagination"><a class="page-link bg-dark badge-dark" id="pagination" href="#" onclick="setPage(${i})">${i}</a></li>`
      }
  }

  ulPages.innerHTML = html;
  
  recipes = recipes.slice((page-1)*4, page*4);

  listaRecetas.innerHTML = recipes
  .map(
    (rcp) => /*html*/ `
    <li class="col-12 col-md-6 col-lg-3">
    <div class="cnt-block equal-hight" style="height: 349px;">
      <figure><img
          src=${rcp.imageUrl}
          class="img-responsive" alt=""></figure>
      <h3><a href="">${rcp.titulo}</a></h3>
      <div class="creador">
        <p>${rcp.autor}: Dificultad: ${rcp.dificultad}</p>
      </div>
      <ul class="follow-us clearfix">
        <li><a href="#"><i class="fas fa-heart fa-lg" onclick="addFav('${rcp.uuid}')" style="color: #757575;" onmouseover="this.style.color='#FFA500'" onmouseout="this.style.color='#757575'" title="Añadir a Favoritos"></i></a></li>
        <li><a href="#"><i class="fas fa-tag fa-lg"  onclick="addMyRecipe('${rcp.uuid}')" style="color: #757575;" onmouseover="this.style.color='#FFA500'" onmouseout="this.style.color='#757575'" title="Añadir a Mis Recetas"></i></a></li>
      </ul>
    </div>
  </li>
    `
    )
  .join("");
}

async function filterRecipes() {
  event.preventDefault()
  const button = document.getElementById('cancelar_filtro')
  button.classList.remove("d-none");

  let newData;
  let recipes=[];
  let ingredientes = String(document.getElementById("ingredients").value);
  let dificulty = Number(document.getElementById("dificulty").value);
  let autor = String(document.getElementById("autor").value);

  let resp = await fetch("/api/main", {
    method: "GET",
    headers: {
      "x-token": "admin",
    },
  });

  recipes= await resp.json();

  if(ingredientes!=''){
    newData=recipes.filter(rcp=>rcp.ingredientes.toUpperCase().includes(ingredientes.toUpperCase()))
  }
  if(dificulty>0){
    newData=recipes.filter(rcp => parseInt(rcp.dificultad)==parseInt(dificulty));
  }
  if(autor!=''){
    newData=recipes.filter(rcp=>rcp.autor.toUpperCase().includes(autor.toUpperCase()))
  }

  listaRecetas.innerHTML = newData
    .map(
      (rcp) => /*html*/ `
      <li class="col-12 col-md-6 col-lg-3">
      <div class="cnt-block equal-hight" style="height: 349px;">
        <figure><img
            src=${rcp.imageUrl}
            class="img-responsive" alt=""></figure>
        <h3><a href="">${rcp.titulo}</a></h3>
        <div class="creador">
          <p>${rcp.autor}: Dificultad: ${rcp.dificultad}</p>
        </div>
        <ul class="follow-us clearfix">
          <li><a href="#"><i class="fas fa-heart fa-lg" onclick="addFav('${rcp.uuid}')" style="color: #757575;" onmouseover="this.style.color='#FFA500'" onmouseout="this.style.color='#757575'" title="Añadir a Favoritos"></i></a></li>
          <li><a href="#"><i class="fas fa-tag fa-lg"  onclick="addMyRecipe('${rcp.uuid}')" style="color: #757575;" onmouseover="this.style.color='#FFA500'" onmouseout="this.style.color='#757575'" title="Añadir a Mis Recetas"></i></a></li>
        </ul>
      </div>
    </li>
      
      `
    )
    .join("");

}
