var markadores = {};
var posiciones = [];
function repartidoresListen(){
    firebase.database().ref('ubicacion/').on('value', function(data) {
       var image = "./assets/moto.png";
          
       for (const key in data.val()) {
            if(markadores.hasOwnProperty(key)){
                markadores[key].setPosition({
                    lat: data.val()[key]['lat'],
                    lng: data.val()[key]['lng']
                  });
            }
            else{
                markadores[key] = new google.maps.Marker({
                    position: {
                      lat: data.val()[key]['lat'],
                      lng: data.val()[key]['lng']
                    },
                    map: map,
                    icon: image
                  });
                  posiciones.push({...data.val()[key],id_repartidor: key});
            }
        }
    });
}

function igualPass(form=false){
  var pass1 = document.getElementById("password").value;
  var pass2 = document.getElementById("password2").value;

  if(pass1 != "" && pass2 != ""){
    if(pass1 == pass2){
      if(!form){

        M.toast({
          html: 'Las contraseñas son iguales',
          classes: "toast",
          displayLength: 3000
        });
      }
      return true;
    }
    else{
      M.toast({
        html: 'Las contraseñas son diferentes',
        classes: "toast",
        displayLength: 3000
      });
      return false;
    }
  }
}

function repartidor(){
  var inpuRep = document.getElementsByClassName("inpRep");
  var body = {
    apellidoPaterno: inpuRep[0].value,
    apellidoMaterno: inpuRep[1].value,
    nombre: inpuRep[2].value,
    email: inpuRep[3].value,
    contrasena: inpuRep[4].value,
    contacto1: inpuRep[6].value
  };
  var completo = true;
  for (const key in body) {
    if(body[key] == ""){
      completo = false;
      break;
    }
  }

  
  if(completo){
    var pass = igualPass(true);
    if(pass){
      var jsonString = JSON.stringify(body);
      console.log(body);
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.open("POST", "http://localhost:8888/repartidorAPI/registrar.php");
      xmlhttp.setRequestHeader('Content-Type', 'application/json');
      xmlhttp.onload = function() {
        console.log(this.status);
        if (this.readyState == 4 && this.status == 200) {
          console.log(this.responseText);
          var response = JSON.parse(this.responseText);
          console.log(response);
          if(response['success'] ){
            Swal.fire(
              '!Bien!',
              'Se ha agregado un nuevo repartidor.',
              'success'
            );
          }
          else{
            if(response['msg']=="Usuario existente"){
              M.toast({
                html: 'El usuario ya existe',
                classes: "toast",
                displayLength: 3000
              });
            }
          } 
        }
      };
      xmlhttp.send(jsonString);
    }
  }
else{
  M.toast({
    html: 'Llene todos los campos',
    classes: "toast",
    displayLength: 3000
  });
}
}