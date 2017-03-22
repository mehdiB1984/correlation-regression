<div class="row">
             <div class="col-xs-3 col-xs-offset-1" >
              <div class="form-group ">
                  <label for="cc_points_value" data-i18n="cc.points.value">Puntos a Generar</label>
                  <input id="cc_points_value" type="number"  min="3" max="500" autofocus>
                  
              </div>            
            </div>
            <div class="col-xs-2" >
                <button id="cc_start" type="button" class="btn btn-default" >
                  <span class="glyphicon glyphicon-play"></span> Ejecutar
               </button>       
            </div>
            <div class="col-xs-2" >
                 <button id="cc_reset"  type="button" 
                  class="btn btn-default" >
                 <span class="glyphicon glyphicon-step-backward"></span> Inicializar
                 </button>
            </div>
            <div class="col-xs-1" >
                 <a href= "#cc_info" class="btn btn-info" data-toggle="modal" > 
                 <span class="glyphicon glyphicon-info-sign"></span>
                 </a>
                   <div class="modal fade" id="cc_info" >
                      <div class="modal-dialog">
                        <div class="modal-content">
                           <!--header de la ventana-->
                             <div class="modal-header">
                                <div style="text-align:left;">
                                    <img src="/images/logo.png">
                                </div>
                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>                         
                                <h4 class="modal-title">Herramienta para la visualización de conceptos relacionados con la correlación y la regresión lineal</h4>                  
                             </div>
                            <!-- Contenido de nuestra ventana-->
                             <div class ="modal-body" style= "text-align:left;">
                                    <p> Esta simulación solicita un tamaño de muestra en el cuadro de texto Puntos a generar.
                                        Asi al pulsar el botón Ejecutar, internamente se genera una muestra aleatoria bivariante con el tamaño fijado.</p>
                                    <p> Los puntos generados son representados en un plano cartesiano.Cada vez que se pulse el botón Ejecutar, se recalcula una nueva muestra y es representada , sustituyendo a la anterior .El botón Inicializar permite reiniciar la simulación. </p>                            
                                    <p> Las casillas de verificación</p>                            
                                    <p>- Mostrar coeficiente de correlación: hace que muestre el valor del coeficiente de correlación de la muestra generada.                                    
                                    <p>- Mostrar covarianza : hace aparecer el valor de la covarianza de los puntos muestrales.</p>                         
                                    <p>- Mostrar recta de regresión : hace aparecer la línea de regresión en la misma ventana en que se muestran los puntos. </p>
                             </div>
                            <!-- Contenido del footer-->
                             <div class="modal-footer" >
                                    <div style= "text-align:left;">
                                        <p>Autor - Mehdi Benjelloun</p>
                                        <p>Directores-Roberto Espejo Mohedano ,José Diz Pérez</p>
                                        <p>Copyright2017©. Universidad de Córdoba .Departamento de Estadística,Econometría,Investigación Operativa, Organización de empresas y Economía Aplicada</p>                                        
                                    </div>
                                    <button type="button" class="btn btn-primary" data-dismiss="modal">OK</button>   
                             </div>
                        </div>                 
                      </div>                   
                    </div>
             </div>      
</div>  
<div    id="contenedor" class="row">        
         <div id="cc_chart_container" class="col-xs-9 col-left well" style="height: 400px" >

         </div>
       
        <div class="col-xs-3">
          <form class="form-horizontal text-left" style="margin:25px;">
                 <div class="form-group">
                     <input type="checkbox" id="cc_regresionLine"> Mostrar Recta de Regresión   
                     <input type="text" class="form-control" id="cc_regresionLine_text" readonly="">
                 </div>
                 <div class="form-group">
                     <input type="checkbox" id="cc_coeficient"> Mostrar Coeficiente de Correlación  
                     <input type="text" class="form-control" id="cc_coeficient_text" readonly="">
                 </div>                                    
          </form>     
        </div> 
</div> 


