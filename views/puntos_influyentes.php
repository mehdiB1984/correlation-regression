<div class="row">  
               <form class="form-inline">
                 <div class="form-group">
                   <div class="col-xs-5" >
                         <button id="pi_regresionLine" type="button" class="btn btn-default">
                         <img src="images/graf.png"> Generar Recta de Regresión
                         </button>
                    </div>
                    <div class="col-xs-2">
                         <button id="pi_reset" type="button" class="btn btn-default">
                         <span class="glyphicon glyphicon-step-backward"></span> Inicializar
                         </button> 
                    </div>
                    <div class="col-xs-3" style="margin-left:15px;">
                         <button id="pi_coordinate" type="button" class="btn btn-default">
                         <img src="images/tabla.png"> Coordenadas
                         </button>
                     </div>
                    <div class="col-xs-1">
                         <a href="#pi_info" class="btn btn-info" data-toggle="modal"> 
                         <span class="glyphicon glyphicon-info-sign"></span>
                         </a>
                      <div class="modal fade" id="pi_info">
                         <div class="modal-dialog">
                           <div class="modal-content">
                           <!--header de la ventana-->
                             <div class="modal-header">
                               <div style="text-align:left">
                                <img src="/images/logo.png">
                                </div>
                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>                         
                                <h4 class="modal-title">Herramienta para la visualización de conceptos relacionados con la correlación y la regresión lineal</h4>                  
                             </div>
                           <!-- Contenido de nuestra ventana-->
                             <div class ="modal-body" style="text-align:left;">
                                    <p> Esta simulación permite situar puntos en un plano cartesiano haciendo clic con el ratón y sobre el punto considerado de la zona de Representación gráfica .Si sobre un punto ya dibujado se hace clic con el ratón, el punto es eliminado.</p>   
                                    <p>El botón Generar recta de regresión hace que se hace la línea de regresión correspondiente a los puntos dibujados en ese momento sobre el plano.</p>
                                     <p>Una vez trazada la línea de regresión , al dibujar nuevos puntos , se traza la recta de regresión adaptada a la  nueva nube de puntos. La recta de regresión que se trazó inicialmente cambia a color azul y permanece constante mientras que se pulse botón Inicializar o se vuelva a pulsar el botón Generar recta de regresión .</p>
                                     <p>En la ventana de Resultados se puede ver el modelo de regresión y el coeficiente de correlación, tanto para la nube de puntos inicial como para la nube de puntos modificada(nube de puntos"actual").</p>
                                     <p>El botón Coordenadas  muestra una tabla con las coordenadas de los puntos considerados.En esta ventana se pueden agregar y eliminar manualmente coordenadas al modelo.</p>
                                     <p>El Zoom permite ampliar o reducir el área que se visualiza en la Representación gráfica.Una vez ampliada la ventana de visualización, la zona visible se puede modificar pulsando y arrastrando el botón del ratón sobre la ventana de visualización.
                                     Las escalas sobre ambos ejes coordenados se pueden modificar arrastrando la barra de desplazamiento que aparece junto a cada eje.</p>
                                        
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
                </form>
 </div>
 <br>
 <div class="row row-centered">
    <div id="pi_chart_container" class="col-xs-11 col-centered well">

    </div>
</div>