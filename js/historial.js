function historial(){
    firebase.database().ref('pedidos-finalizados/').on('value', function(data) {
        var historialObjeto = data.val();
        var historial = [];
        var meses = {
          0: "Enero",
          1: "Febrero",
          2: "Marzo",
          3: "Abril",
          4: "Mayo",
          5: "Junio",
          6:"Julio",
          7: "Agosto",
          8:"Septiembre",
          9:"Octubre",
          10:"Noviembre",
          11:"Diciembre"
        };
      
        console.log(historialObjeto);
        for (const id in historialObjeto) {
            for (const key in historialObjeto[id]) {
                var pedido = historialObjeto[id][key];
                var fecha = new Date(pedido['fecha_realizacion']);
                var fecha_text = "" + fecha.getDate() + " de " + meses[fecha.getMonth()];
                if(historial.length !=0){
                    historial.map((data)=>{
                        if((data['fecha'] == fecha_text)){
                            data['pedidos'].push({
                              hora: fechaLex(fecha),
                              monto: "" + pedido['monto'],
                              tipo: "" + pedido['tipo'],
                              id_repartidor: id
                            });
                          }
                          else{
                            historial.push({
                              fecha: fecha_text,
                              pedidos: [
                                {
                                  hora: fechaLex(fecha),
                                  monto: "" + pedido['monto'],
                                  tipo: "" + pedido['tipo'],
                                  id_repartidor: id

                                }
                              ]
                            });
                          }
                    });
                }
                else{
                    historial.push({
                      fecha: fecha_text,
                      pedidos: [
                        {
                          hora: this.fechaLex(fecha),
                          monto: "" + pedido['monto'],
                          tipo: "" + pedido['tipo'],
                          id_repartidor: id

                        }
                      ]
                    });
                  }
            }
        }

        historial.map((data)=>{
            var div = document.createElement("DIV");
            div.setAttribute("class","fecha");
            var fecha_text = document.createElement("P");
            fecha_text.setAttribute("class","fecha-texto");
            fecha_text.innerHTML = data['fecha'];
            div.appendChild(fecha_text);
            data['pedidos'].map((data)=>{
                var pedido = document.createElement("DIV");
                pedido.setAttribute("class","pedido");
                var hora = document.createElement("DIV");
                hora.setAttribute("class","hora");
                var hora_text = document.createElement("P");
                hora_text.setAttribute("class","hora-texto");
                hora_text.innerHTML = data['hora'];

                hora.appendChild(hora_text);

                var info = document.createElement("DIV");
                info.setAttribute("class","info");
                var monto_text = document.createElement("P");
                monto_text.setAttribute("class","monto-texto");
                monto_text.innerHTML = "$"+data['monto'];
                var tipo_text = document.createElement("P");
                tipo_text.setAttribute("class","tipo-texto");
                tipo_text.innerHTML = data['tipo'];
                var id_text = document.createElement("P");
                id_text.setAttribute("class","tipo-texto");
                id_text.innerHTML = "id repartidor : "+data['id_repartidor'];

                info.appendChild(monto_text);
                info.appendChild(tipo_text);
                info.appendChild(id_text);

                pedido.appendChild(hora);
                pedido.appendChild(info);

                div.appendChild(pedido);

            });
            var historial = document.getElementById("test3");
            historial.appendChild(div);
        });
    });
}

function fechaLex(fecha){
    let horas = fecha.getHours();
    let minutos = fecha.getMinutes();
    let ampm = "";

    if (horas >= 12) {
      horas = horas - 12;
      ampm = 'P.M.';
    } else {
      ampm = 'A.M.';
    }

    // Detectamos cuando sean las 0 AM y transformamos a 12 AM
    if (horas == 0) {
      horas = 12;
    }

    // Si queremos mostrar un cero antes de las horas ejecutamos este condicional
    // if (horas < 10){horas = '0' + horas;}

    // Minutos y Segundos
    if (minutos < 10) {
        return horas + ":" + "0" + minutos + " " + ampm;

    }
    else{
      return horas + ":" + minutos + " " + ampm;
    }


  }