var markadores = {};
var posiciones = [];
function repartidoresListen(){
    firebase.database().ref('ubicacion/').on('value', function(data) {
       var image = "https://static.thenounproject.com/png/1576913-200.png";
          
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