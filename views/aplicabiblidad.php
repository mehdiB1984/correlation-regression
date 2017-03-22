<div class="row">
    <div class="row">
            <div class="col-xs-2 col -xs-offset" >
               <div class="form-group ">
                  <label for="ap_points_value" >Puntos a Generar</label>
                  <input id="ap_points_value" type="number"  min="3" max="500">
              </div>           
            </div>
            <div class="col-xs-2" >
                  <button id="ap_start" type="button" class="btn btn-default" >
                  <span class="glyphicon glyphicon-play"></span> Ejecutar
               </button>       
            </div>
            <div class="col-xs-2" >
                 <button id="ap_reset" type="button" class="btn btn-default ">
                 <span class="glyphicon glyphicon-step-backward"></span> Inicializar
                 </button>
            </div>
            <div class="col-xs-1" >
                 <a href="#ap_info" class="btn btn-info" data-toggle="modal"> 
                 <span class="glyphicon glyphicon-info-sign"></span>
                 </a>
                   <div class="modal fade" id="ap_info">
                      <div class="modal-dialog">
                        <div class="modal-content">
                           <!--header de la ventana-->
                             <div class="modal-header">
                             <!--   <div style="text-align:left">
                                      <img src="/images/logo_set.png">
                                </div>-->
                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>                         
                                <h4 class="modal-title">Herramienta para la visualización de conceptos relacionados con la correlación y la regresión lineal</h4>                  
                             </div>
                            <!-- Contenido de nuestra ventana-->
                             <div class ="modal-body" style= "text-align:left;">
                                    <p> Esta simulación genera muestras aleatorias de poblaciones que siguen tres modelos funcionales , representados como Función 1,2 y 3, respectivamente en la lista desplegable Tipo de muestra que se puede ver la parte derecha de la ventana.La muestra se genera sobre un intervalo de valores de X cuya amplitud va de 1 a 6 según elija el usuario de la lista desplegable Amplitud intervalo de muestreo que aparece también en la parte derecha de la ventana. </p>
                                    <p>El centro del intervalo se toma aleatoriamente , de modo que todo el intervalo generado pueda ser visualizado en la escala del eje X representada.</p>
                                   <p>El cuadro de texto Tamaño de muestra permite especificar el número de puntos que serán generados .</p>
                                   <p> El botón Ejecutar realiza la simulación y hace que se dibujen en el área de Representación gráfica , tanto los límites del intervalo de valores de X entre los que se efectúa el muestreo , como los puntos muestrales generados.</p>
                                   <p>El botón Inicializar permite reinicializar el proceso.</p>
                                   <p>Cada vez que se pulsa el botón Ejecutar se genera una nueva muestra en un nuevo intervalo de la amplitud especificada, pero aleatoriamente situado.Si se desea que los puntos sean generados siempre en el mismo intervalo.Hay que activar la casilla de verificación Fijar intervalo. </p>
                                   <p>La casilla de verificación Mostrar recta de regresión hace que se represente dicha recta en el área de Representación gráfica .Una vez activa esta opción , cuando se pulsa con el ratón sobre cualquier punto del área de Representación gráfica , se traza una lénea vertical que va desde el eje de ascisas, con el valor de X que correspondiera al punto donde pulsamos con el ratón, hasta el valor estimado por el modelo lineal para la variable dependiente, correspondiente a este valor de X. </p>
                                  <p> la casilla de verificación Mostrar población hace que se tracen en el área de Representación gráfica una serie de puntos siguiendo la verdadera tendencia que corresponda a la función elegida de la lista Tipo de muestra .</p>
                                   <p>la casilla de verificación Mostrar modelo poblacional hace que se dibuje la línea correspondiente a la función elegida de la lista Tipo de muestra.</p>
                                
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
 <div class="row">
        <div class="col-xs-9">
         <form>
           <fieldset>
             <legend align ="left">Representación Gráfica</legend> 
             <div id="" class="col-xs-9   well" >
             </div>               
           </fieldset>              
          </form>             
         </div>        
        <div class="col-xs-3">
          <form class="form-horizontal">
              <div class="form-group">
                  <div style= "text-align:left;">
                     <span > Tipo de muestra</span>
                  </div>
                   <select id="id_function" class="form-control">
                          <option value="ap_function_random1" selected>Función 1</option>
                          <option value="ap_function_random2">Función 2</option>
                          <option value="ap_function_random3">Función 3</option>
                   </select>
               </div> 
              <div id="ap_interval" class="form-group">
                  <div style= "text-align:left;">
                     <span >Amplitud intervalo de muestreo</span>
                  </div>
                   <select id="ap_interval_value" class="form-control">
                          <option value="1" selected="">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>                                        
                   </select>
               </div>
             <div class="checkbox text-left" style="margin-right:15px;">      
                 <input id="ap_draw_line" type="checkbox"> Mostrar Recta de Regresión  
                 <br>
                 <input id="ap_draw_population" type="checkbox"> Mostrar Población
                 <br>
                 <input id="ap_draw_model" type="checkbox"> Mostrar Modelo Poblacional
                 <br>
                 <input id="ap_draw_interval" type="checkbox" disabled> Fijar Intervalo
                 <br>
                <div class="form-group">
                     <label for="ap_result_coeficient" style="margin-left:-18px;" > Mostrar Coeficiente de Correlación  </label>
                     <input type="text" class="form-control" id="ap_result_coeficient" readonly="">
                 </div>
                 
             </div>  
          </form>     
        </div> 
    </div>                   
            


    

</div>
