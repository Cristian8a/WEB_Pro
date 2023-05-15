let cart = [];
let listaRecetas = document.getElementById("Cart");

async function loadFavorites() {
  let resp = await fetch("/api/favorites", {
    method: "GET",
    headers: {
      "x-token": "admin",
    },
  });

  cart = await resp.json();
  //console.log(JSON.stringify(cart));

  //pagination
  let page = 1;
  if (!sessionStorage.getItem("page")) {
    sessionStorage.setItem("page", page);
  } else {
    page = sessionStorage.getItem("page");
  }

  let numOfPages = Math.ceil(cart.length / 4);
  let ulPages = document.getElementById("pages");
  let html = "";

  for (let i = 1; i <= numOfPages; i++) {
    if (i != page) {
      html += /* html*/ `<li class="page-item pagination"><a class="page-link badge-light" id="pagination" href="#" onclick="setPage(${i})">${i}</a></li>`;
    } else {
      html += /* html*/ `<li class="page-item bg-dark active pagination"><a class="page-link bg-dark badge-dark" id="pagination" href="#" onclick="setPage(${i})">${i}</a></li>`;
    }
  }

  ulPages.innerHTML = html;

  cart = cart.slice((page - 1) * 4, page * 4);

  listaRecetas.innerHTML = cart
    .map(
      (rcp) => /*html*/ `
      <li class="col-12 col-md-6 col-lg-3">
        <div class="cnt-block equal-hight" style="height: 349px;">
            <figure><img src=${rcp.imageUrl} class="img-responsive" alt=""></figure>
            <h3><a href="">${rcp.titulo}</a></h3>
            <div class="creador">
                <p>${rcp.autor}: Dificultad: ${rcp.dificultad}</p>
            </div>
            <ul class="follow-us clearfix">
                <li><a href="#"><i class="fas fa-tag fa-lg" onclick="addMyRecipe('${rcp.uuid}')" style="color: #757575;"
                            onmouseover="this.style.color='#FFA500'" onmouseout="this.style.color='#757575'"
                            title="Añadir a Mis Recetas"></i></a></li>
                <li><a href="#"><i class="fas fa-trash fa-lg" onclick="eliminarReceta('${rcp.uuid}')"
                            style="color: #757575;" onmouseover="this.style.color='#FFA500'"
                            onmouseout="this.style.color='#757575'" title="Añadir a Mis Recetas"></i></a></li>
            </ul>
        </div>
    </li>
      `
    )
    .join("");
}

async function addMyRecipe(uuid) {
  event.preventDefault();

  let resp = await fetch("/api/main/" + uuid, {
    method: "GET",
    headers: {
      "x-token": "admin",
    },
  });

  MyRecipe = await resp.json();

  console.log("elemetnos son: ", MyRecipe);
  //console.log(JSON.stringify(cart));
  await fetch("/api/recetas/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": "admin",
    },
    body: JSON.stringify({
      titulo: MyRecipe.autor,
      descripcion: MyRecipe.descripcion,
      dificultad: MyRecipe.dificultad,
      imageUrl: MyRecipe.imageUrl,
      ingredientes: MyRecipe.ingredientes,
      autor: MyRecipe.autor,
    }),
  });
}

async function eliminarReceta(uuid) {
  await fetch("/api/favorites/" + uuid, {
    method: "DELETE",
    headers: {
      "x-token": "admin",
    },
  });
  loadFavorites();
}

function setPage(nPage) {
  event.preventDefault();
  sessionStorage.setItem("page", nPage);
  loadFavorites();
}

loadFavorites();
