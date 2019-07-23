document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems);
  
  
});

var map,origen,destino;
var coordsOrigen = {
  lat: 0,
  lng: 0
};
var coordsDestino = {
  lat: 0,
  lng: 0
}

    function initMapa(){
      map = new google.maps.Map(document.getElementById('mapa'), {
        center: new google.maps.LatLng(20.67644842172207, -101.35654463273977),
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    
      });

      var pinOri, pinDest;

      repartidoresListen();
    
      var element = document.getElementById("dirOri");
      var element2 = document.getElementById("dirDes");

      var elementkmLabel = document.querySelectorAll("[for]");
      elementkmLabel[2].setAttribute("class","active");
      elementkmLabel[9].setAttribute("class","active");
    
      var search = new google.maps.places.Autocomplete(element);
      search.bindTo("bounds", map);
    
      var search2 = new google.maps.places.Autocomplete(element2);
      search2.bindTo("bounds", map);

      search.addListener('place_changed', function() {
        var place = search.getPlace();
        if(pinOri){
          pinOri.setMap(null);
        }
        pinOri = new google.maps.Marker({
          position: new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng()),
          map: map,
          draggable: true,
          animation: google.maps.Animation.DROP
      });
        origen = place.geometry.location;
        coordsOrigen.lat = place.geometry.location.lat();
        coordsOrigen.lng = place.geometry.location.lng();
        if(destino){
          obtenerDistancia(origen,destino);
        }
        pinOri.addListener("dragend", function(event) {
          origen = event.latLng;
          coordsOrigen.lat = event.latLng.lat();
          coordsOrigen.lng = event.latLng.lng();
          if(destino){
            obtenerDistancia(origen,destino);
    
          }
    
      });
        // map.panTo(place.geometry.location);
        // pin.setPosition(place.geometry.location);
        // $('#lat').val(place.geometry.location.lat());
        // $('#long').val(place.geometry.location.lng());
    });

    search2.addListener('place_changed', function() {
      var place = search2.getPlace();
      if(pinDest){
        pinDest.setMap(null);
      }
      pinDest = new google.maps.Marker({
        position: new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng()),
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP
    });
      destino = place.geometry.location;
      coordsDestino.lat = place.geometry.location.lat();
      coordsDestino.lng = place.geometry.location.lng();
      if(origen){
        obtenerDistancia(origen,destino);

      }


  pinDest.addListener("dragend", function(event) {
    destino = event.latLng;
    coordsDestino.lat = event.latLng.lat();
    coordsDestino.lng = event.latLng.lng();
    if(origen){
      obtenerDistancia(origen,destino);

    } 

  });
      // map.panTo(place.geometry.location);
      // pin.setPosition(place.geometry.location);
      // $('#lat').val(place.geometry.location.lat());
      // $('#long').val(place.geometry.location.lng());
  });

 
  
    }

   function obtenerDistancia(origin, destination) {
  ;

      let service = new google.maps.DistanceMatrixService;
        service.getDistanceMatrix({
          origins: [origin],
          destinations: [destination],
          travelMode: 'DRIVING',
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false
        }, (response, status) => {
          console.log(response);
          console.log(status);
          if (status == 'OK') {
            if (response.rows[0].elements[0].status != 'ZERO_RESULTS') {
              conversionKM(response.rows[0].elements[0]['distance']['value']);
              }
          }
        });
    }

   function conversionKM(metros){

      var km = metros/1000;
      var distancia = Math.floor(km);
      var hora = new Date();
      var horas = hora.getHours();
      var minuto = hora.getMinutes();
      var costEnvio = 30;
      if(hora > 20 && hora < 23){
        costEnvio = 40;
      }
      if(hora > 23 && hora < 8){
        costEnvio = 50;
      }
        if(distancia - 3 > 0){
          var kmextra = distancia - 2;
          kmextra = kmextra * 3;
          costEnvio = costEnvio + kmextra;
        }

        var elementkm = document.getElementById("km");
        elementkm.value = distancia; 
        var elementEnvio = document.getElementById("envio");
        elementEnvio.value = costEnvio; 

        var elementkmLabel = document.querySelectorAll("[for]");
        elementkmLabel[11].setAttribute("class","active");
        elementkmLabel[12].setAttribute("class","active");
        console.log(elementkmLabel);

    }

    function repartidor(){
      var form = document.getElementsByTagName("input");
      var campo = true;
      // for (var index = 0; index < form.length; index++) {
      //   if(form[index].value == ""){
      //     console.log("llene todos los campos");
      //     Swal.fire({
      //       type: 'error',
      //       title: 'Oops...',
      //       text: '!Llene todos los campo!',
      //     });
      //     campo = false;
      //     break;

      //   }

        
      // }
      if(campo){
        var peticion = {
          status: 1,
          tipo: "dash",
          nomOri: form[0].value,
          telOri: form[1].value,
          dirOri:{
            direccion: form[2].value,
            lat: coordsOrigen.lat,
            lng: coordsOrigen.lng
          },
          refOri: form[3].value,
          tipoServ: form[4].value,
          compra: form[5].value,
          monto: form[6].value,
          nomDest: form[7].value,
          telDest: form[8].value,
          dirDest:{
            direccion: form[9].value,
            lat: coordsDestino.lat,
            lng: coordsDestino.lng
          },
          refDest: form[10].value,
          km: form[11].value,
          costoEnvio: form[12].value,
          quienPaga: form[13].value,
          instruccion: form[14].value
        };

        var distancias = this.getAllDistance(posiciones,coordsOrigen);
        distancias.then(data=>{
          let menor = 0;
          let key = 0;
          data.map((data,index)=>{
            if( data['response']['status'] == "OK"){
              if(index == 0){
                menor = data['response']['distance']['value'];
                key = data['key'];
              }
              else{
                if(menor > data['response']['distance']['value']){
                  menor = data['response']['distance']['value'];
                  key = data['key'];
                }
              }
            }
          });
          console.log(menor);
          console.log(key);
          firebase.database().ref('pedidos/' + key).push(peticion);
          firebase.database().ref('pedidos/' + key).on('value', function(data) {
            console.log(data.val());
          });     
        });
      }
    }

    function getAllDistance (starts, end) {
      var promisedDistances = starts.map((start) => this.getDistance(start, end));
      // Promise.all turns an array of promises into a promise
      // that resolves to an array.
      return Promise.all(promisedDistances);
    }

    function getDistance (start, end) {
      var origin = new google.maps.LatLng(start['lat'], start['lng']);
      var final = new google.maps.LatLng(end['lat'], end['lng']);
      var service = new google.maps.DistanceMatrixService();
    
      return new Promise((resolve, reject) => {
        service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [final],
          travelMode: 'DRIVING',
          unitSystem: google.maps.UnitSystem.METRIC
        }, (response, status) => {
          if(status === 'OK') {
            resolve({ 
              response: response.rows[0].elements[0],
              key: start['id_repartidor']
             },
              );
          } else {
            reject(new Error('Not OK'));
          }
        }
      );
      });
    }
    