<ul id="tabs" class="nav nav-tabs nav-justified">
    <li role="presentation" class="active">
      <a href="#coeficiente_correlacion" data-toggle="tab" role="tab" data-i18n="tabs.coef_corr"></a>
    </li>
    <li role="presentation">
      <a href="#distribucion_muestral" data-toggle="tab" role="tab" data-i18n="tabs.dist_muestral"></a>
    </li>
    <li role="presentation">
        <a href="#puntos_influyentes" data-toggle="tab" role="tab" data-i18n="tabs.pts_influyentes"></a>
    </li>
    <li role="presentation">
        <a href="#aplicabilidad" data-toggle="tab" role="tab" data-i18n="tabs.apli_lineal"></a>
      </li>
</ul>
<div id="tabs-content" class="tab-content" style="margin-top: 20px;">
  <div class="tab-pane active" id="coeficiente_correlacion">
      <?php require_once(dirname(__FILE__) . "/coeficiente_correlacion.php") ?>
  </div>
  <div class="tab-pane" id="distribucion_muestral">
        <?php require_once(dirname(__FILE__) . "/distribucion_muestral.php") ?>
  </div>
  <div class="tab-pane" id="puntos_influyentes">
        <?php require_once(dirname(__FILE__) . "/puntos_influyentes.php") ?>
  </div>
  <div class="tab-pane" id="aplicabilidad">
        <?php require_once(dirname(__FILE__) . "/aplicabiblidad.php") ?>
  </div>


</div>
