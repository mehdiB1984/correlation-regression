<div class="row">  
    <form class="form-inline">
             <div class="form-group">
               <button id="dm_start" type="button" class="btn btn-default">
                  <span class="glyphicon glyphicon-play"></span> Iniciar
               </button>
               <button  id="dm_reset" type="button" class="btn btn-default">
                  <span class="glyphicon glyphicon-step-backward"></span> Inicializar
               </button>           
              <div class="form-group ">
                  <label for="dm_points_value" >Tamaño Muestral</label>
                  <input id="dm_points_value"type="number"  min="3" max="500">
              </div> 
               <button  id="dm_oneByOne" type="button" class="btn btn-default">
                     <span class="glyphicon glyphicon-play"></span> Uno a uno
               </button>
               <button id= "dm_fixed" type="button" class="btn btn-default">
                     <span class="glyphicon glyphicon-play"></span> Número fijo
               </button>
               <div class="form-group">
                   <select id="dm_repeat" class="form-control">
                          <option value="10" selected>10</option>
                          <option value="20">20</option>
                          <option value="50">50</option>
                          <option value="100" >100</option>
                          <option value="500">500</option>
                          <option value="500">1000</option>
                          <option value="500">3000</option>               
                   </select>
               </div>         
               <button id="dm_run" type="button" class="btn btn-default">
                     <span class="glyphicon glyphicon-forward"></span> Iniciar
               </button>        
               <a href="#dm_info" class="btn btn-info" data-toggle="modal"> 
               <span class="glyphicon glyphicon-info-sign"></span>
               </a>
                   <div class="modal fade" id="dm_info">
                       <div class="modal-dialog">
                         <div class="modal-content">
                           <!--header de la ventana-->
                             <div class="modal-header">
                                <div style="text-align:left">
                                <img src="imagenes/logo_set.png">
                                </div>
                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>                         
                                <h4 class="modal-title">Herramienta para la visualización de conceptos relacionados con la correlación y la regresión lineal</h4>                  
                             </div>
                            <!-- Contenido de nuestra ventana-->
                             <div class ="modal-body" style="text-align:left;">
                                <p>Esta simulación permite visualizar la distribución en el muestreo del coeficiente de correlación  y de los coeficientes del modelo de regresión lineal univariante.</p>
                                 <p>Se considera el caso de dos variables incorreladas , que se corresponde con las hipótesis nulas para los contrastes sobre dichos coeficientes</p>
                                 <p>Cada vez que se pulsa el botón Iniciar ,se genera una nube de 500 puntos sin tendencia ni ordenada en el origen,correspondiente a una población normal bivariante con p=0. </p>
                                 <p>Es la representación de la población de valores de dicha normal bivariante.</p>
                                 <p>Sobre esta nube de puntos "poblacional" , se genera la línea de regresión también"poblacional",Y=0, que no es otra que el propio eje X.</p>
                                 <p>Al pulsar el botón Inicializar se borra todo lo representado y podemos reiniciar la simulación. </p>
                                 <p>Para estudiar la distribución en el muestreo de los coeficientes, es preciso generar muestras, calcular los cocientes entre cada coeficiente y su error estándar para cada muestra , tabular estos coeficientes y representar el histograma correspondiente a las tablas de frecuencias de los cocientes.Una vez que se hayan generado un número suficiente de muestras, se puede comprobar que cada uno de los histogramas tiende a una distribución t de student con (n-2) grados de libertad.</p>
                                 <p>El cuadro de texto Tamaño muestral requiere un número entero para fijar el número de elementos que tendrá la muestra de puntos que se generará.</p>
                                 <br>
                                 <p>- El botón Uno a uno realiza la simulación una vez , generando una muestra con el tamaño fijado por el usuario , representa en color rojo dicha muestra y la recta de regresión muestral sobre la nube de puntos poblacional.Cada vez que se genera una nueva muestra, se recalcula la tabla de frecuencias de los estadísticos considerados y se actualizan los histogramas que se representan en las ventanas de la derecha. </p>
                                 <p>- El botón Número fijo repite internamente tantas veces la simulación como se hayan indicado en la lista desplegable    que aparece a su derecha , actualiza las tablas de frecuencia y los gráficos y muestra los resultados de la última muestra.</p>
                                 <p>- El botón Continuo genera muestras y realiza los cálculos y representaciones una a una sin terminar hasta que se pulse el mismo botón , que ahora aparece con el rótulo Detener.</p>
                                 
                                
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
   </form>  
</div>
<br>          
<div class="row">
    <div class="col-xs-9">
            <div class="row">
               <div id="dm_chart_container" class="col-xs-9  col-left well" style="width: 900px;" >
               </div>
            </div>
            <div class="row">
            <form class="form-inline">
               <fieldset >
                <legend align ="left"></legend> 
                <div class="container">
                  <div class="col-xs-9">    
                   <h6 align="left">Resultados</h6>              
                    <table id="dm_table" class="table table-condensed">
                     <thead>
                       <tr>
                         <th>Nº muestra</th>
                         <th>Puntos muestra</th>
                       </tr>
                     </thead>
                     <tbody>
                       <tr>
                         <td>.....</td>
                         <td>----</td>        
                       </tr>
                     </tbody>   
                    </table>
                 </div>
                </div>
               </fieldset>       
              </form>   
           </div>
        </div>
   
        <div id="dm_chart_histogram1"  class="col-xs-3 col-right well" > 
        </div>

        <div id="dm_chart_histogram2" class="col-xs-3 col-right well"> 
        </div>

        <div id="dm_chart_histogram3" class="col-xs-3 col-right well"> 
        </div>
  </div>   

   
                 
       
