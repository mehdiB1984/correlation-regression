<!DOCTYPE html>
<html>
<head>
    <!--    *********************************************************************************-->
    <!-- TODO: Remember to rename this file to "index.php" and put into root path IMPORTANT! -->
    <!--    *********************************************************************************-->
    <?php
    /* Establecer la codificación de caracteres interna a UTF-8 */
    mb_internal_encoding("UTF-8");
    header('Content-Type: text/html; charset=utf-8');
     session_start();
    $lang = "es";
    if (array_key_exists("lang", $_GET)) {
        $lang = $_GET["lang"];
    } else if (array_key_exists("lang", $_SESSION)) {
        $lang = $_SESSION["lang"];
    }
    if ($lang !== "es" && $lang !== "en" && $lang !== "fr") {
        $lang = "es";
    }
    $base_dir = dirname(__FILE__); // Absolute path to your installation, ex: /var/www/mywebsite
    $doc_root = preg_replace("!{$_SERVER['SCRIPT_NAME']}$!", '', $_SERVER['SCRIPT_FILENAME']); # ex: /var/www
    $protocol = empty($_SERVER['HTTPS']) ? 'http' : 'https';
    $domain = $_SERVER['SERVER_NAME'];
    $port = $_SERVER['SERVER_PORT'];
    $disp_port = ($protocol == 'http' && $port == 80 || $protocol == 'https' && $port == 443) ? '' : ":$port";
    $base_url = preg_replace("!^{$doc_root}!", '', $base_dir); # ex: '' or '/mywebsite'
    $full_url = "$protocol://{$domain}{$disp_port}{$base_url}";

    /****************** PAGE TEXTS ***********************/
    // Arrays to set the texts of page in the available languages
    $title = array("es", "en", "fr");
    $body = array("es", "en", "fr");

    /* NOTE: To include double quotes into som text you must scape it using '\' character. For example: \"	*/

    // Set here the page title
    $title['es'] = "Representación de Correlación y Regresión Lineal.";
    $title['en'] = "Representing of Correlation and Linear Regression.";
    $title['fr'] = "Représentation de corrélation et de régression linéaire.";

    // Set here the page body
    $body['es'] = "Simulación para la visualización de conceptos relativos a la Correlación y Regresión Lineal .";
    $body['en'] = "Simulation for the visualization of concepts related to Correlation and Linear Regression.";
    $body['fr'] = "Simulation pour l'affichage des concepts de corrélation et de régression linéaire.";
    ?>

    <title><?php echo $title[$lang]; ?></title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" href="images/favicon.ico">

    <!-- *********************** TODO: CHANGE PAGE DESCRIPTION AND KEYWORDS **************************** -->
    <meta name="description" content="Herramienta para la visualización de conceptos relacionados con la correlación y la regresión lineal.">
    <meta name="keywords" content="visualización, estadisticas, simulacion, regresion, correlación,">

    <!-- *********************** CSS AND JS **************************** -->
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css">
    <script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>

    <!--    Custom CSS styles -->
    <link href="css/simulation.css" rel="stylesheet" type="text/css"/>
    <link href="css/custom.css" rel="stylesheet" type="text/css"/>
    <link href="css/chart.css" rel="stylesheet" type="text/css"/>

    <!--    External libraries js files -->
    <script src="http://code.highcharts.com/4.1.7/highcharts.js"></script>
    <script src="http://code.highcharts.com/4.1.7/modules/exporting.js"></script>
    <script src="http://code.highcharts.com/4.1.7/highcharts-more.js"></script>
    <script src="//rawgithub.com/phpepe/highcharts-regression/master/highcharts-regression.js"> </script>

    <script src="libs/i18next-1.10.1/i18next-1.10.1.js"></script>
    <script src="libs/rangeslider.js-1.2.1/rangeslider.js"></script>
    <script src="libs/stat/distributions.js"></script>

    <!--    Simulation js files -->
    <script src="js/common.js"></script>
    <script src="js/dc/normal.js"></script>
    <script src="js/dc/student.js"></script>
    <script src="js/dc/chi.js"></script>
    <script src="js/dc/snedecor.js"></script>
    <script src="js/dc/gamma.js"></script>
    <script src="js/dc/beta.js"></script>
    <script src="js/dc/gui.js"></script>
    <script src="js/dd/hyper.js"></script>
    <script src="js/dd/binomial.js"></script>
    <script src="js/dd/poisson.js"></script>
    <script src="js/dd/geometric.js"></script>
    <script src="js/dd/binomial_negative.js"></script>
    <script src="js/dd/gui.js"></script>
    <script src="js/tl/hyper_binomial.js"></script>
    <script src="js/tl/binomial_poisson.js"></script>
    <script src="js/tl/binomial_normal.js"></script>
    <script src="js/tl/poisson_normal.js"></script>
    <script src="js/tl/student_normal.js"></script>
    <script src="js/tl/chi_normal.js"></script>
    <script src="js/tl/gui.js"></script>
    <script src="js/common.js"></script>
    <script src="js/cc/regresion_grafica.js"></script>
    <script src="js/pi/puntos_influyentes_grafica.js"></script>
    <script src="js/dm/regresion_grafica.js"></script>
    <script src="js/dm/histogram1.js"></script>
    <script src="js/dm/histogram2.js"></script>
    <script src="js/dm/histogram3.js"></script>
   
    <script src="js/regression.js"></script>
    <script src="js/simulation.js"></script>
    <script src="js/regression-highcharts.js"></script>
</head>

<body>
<div id="container-fluid">
    <div id="header" class="row text-center">
        <div class="col-xs-12">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h4> <?php echo $title[$lang]; ?></h4>
                </div>
                <div class="panel-body">
                    <p><?php echo $body[$lang]; ?></p>
                    <!-- **************************************************************************************************************-->
                    <!-- ******** TODO: Put into 'simulation' div your simulation view ********-->
                    <!-- ******** It's recommended create your view in other file.php and include it here ********-->
                    <hr>
                    <h3 id="loading">Loading...</h3>

                    <div id="simulation" style="display: none">
                        <!-- include the simulation PHP file -->
                        <?php require_once(dirname(__FILE__) . "/views/simulation.php") ?>
                    </div>
                    <hr>
                </div>
            </div>
        </div>
    </div>
    <div class="row text-center">
        <div class="col-xs-12">
            <div class="row well well-lg text-center">
                <div class="col-xs-2">
                    <a href="http://www.uco.es/dptos/estadistica/estadistica/set/WebGeC/default.php">
                        <img src="http://www.uco.es/dptos/estadistica/estadistica/set/set/logovirtual.gif" class="center-block" style="padding: 10px;">
                    </a>
                </div>

                <div class="col-xs-8">
                    <?php
                    $pie = array("es", "en", "fr");
                    $pie['es'] = "Departamento de Estad&iacute;stica - Universidad de C&oacute;rdoba<br>Aptdo. 3048. E-14080 C&oacute;rdoba (Espa&ntilde;a)";
                    $pie['en'] = "Statistics Department - University of C&oacute;rdoba<br>Aptdo. 3048. E-14080 C&oacute;rdoba (Spain)";
                    $pie['fr'] = "D&eacute;partement des statistiques - Universit&eacute; de Cordoue<br>Aptdo. 3048. E-14080 Cordoue (Espagne)";
                    ?>

                    <p><?php echo $pie[$lang]; ?> Tel: <a href="tel:+34957218568">+34 957 218568</a> Fax: <a href="fax:+34957218563">+34 957 218563</a></p>

                    <?php
                    $coord = array("es", "en", "fr");
                    $coord['es'] = "Coordinadores:";
                    $coord['en'] = "Coordinators:";
                    $coord['fr'] = "Coordonnateurs:";
                    ?>

                    <h4><?php print $coord[$lang]; ?></h4>

                    <p>
                        <a title="ma1esmor@uco.es" href="mailto:ma1esmor@uco.es" class="coord">
                            <i class="fa fa-user fa-fw"></i> Roberto Espejo Mohedano
                        </a>
                        <a title="ma1jubem@uco.es" href="mailto:ma1jubem@uco.es" class="coord">
                            <i class="fa fa-user fa-fw"></i> Manuel Jurado Bello
                        </a>
                        <a title="ma1dipej@uco.es" href="mailto:ma1dipej@uco.es" class="coord">
                            <i class="fa fa-user fa-fw"></i> José Diz Pérez
                        </a>
                    </p>
                </div>
                <div class="col-xs-2">
                    <a href="http://www.uco.es/dptos/estadistica/estadistica/set/index.php">
                        <img src="http://www.uco.es/dptos/estadistica/estadistica/set/set/logo_set.png" class="img-responsive center-block" style="padding: 10px;">
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
<p id="lang" style="display: none;"><?php echo $lang ?></p>
</body>
<script>
    // On document ready (on page load)
    $(document).ready(function () {
        // Load synchronously the translations and after initialize the simulations
        var texts = new Texts();
        texts.init(function () {
            dcProbability = new UtilsProbability(false);
            dc = new DistributionContinuousGui();
            ddProbability = new UtilsProbability(true);
            dd = new DistributionDiscreteGui();
            tl = new TheoremsLimit();

            // Hide the loading text and show the simulation
            $("#loading").hide();
            $("#simulation").show();
        });
    });
</script>
</html>
