<?php
    require_once 'PEAR.php';
    require_once "XML/RPC/Server.php";

    $gettime_sig = array( array( $XML_RPC_String, $XML_RPC_String ));

    function gettime( $msg) {
        global $XML_RPC_erruser;
        global $XML_RPC_Int;
        global $XML_RPC_String;

        return new XML_RPC_Response( new XML_RPC_Value( date( "r"), $XML_RPC_String));
    }

    /* The SERVER itself! */
    $sRpcServer = new XML_RPC_Server(
        array("gettime" => array( "function" => "gettime",
                                  "signature" => $gettime_sig),
              )
        );
?>
