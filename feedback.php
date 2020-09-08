<?php
$feedback = $email = $userlatlon = $mapviewlatlon = $zoom = $ip = $date = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!empty($_POST["feedback"])) {
        $feedback = test_input($_POST["feedback"]);
        $userlatlon = test_input($_POST["userlatlon_en"]);
        $mapviewlatlon = test_input($_POST["mapviewlatlon_en"]);
        $zoom = test_input($_POST["zoomlevel_en"]);
        $date = test_input($_POST["date_en"]);
        $email = test_input($_POST["email"]);

        if (strncmp($date, '20', 2) == 0) {
            if (!empty($_POST["userIP_en"])) {
                $ip = test_input($_POST["userIP_en"]);
                $file = fopen('feedback/'  . $ip .  '.txt', 'a');
                fwrite($file, "-----\n\nDate: " . $date . "\nContact: " . $email . "\nLocation clicked: " . $userlatlon . "\nLocation of map view: " . $mapviewlatlon . "\nZoom level: " . $zoom . "\n\n" . $feedback . "\n\n");
                fclose($file);
            } else {
                $file = fopen('feedback/feedback.txt', 'a');
                fwrite($file, "-----\n\nDate: " . $date . "\nContact: " . $email . "\nLocation clicked: " . $userlatlon . "\nLocation of map view: " . $mapviewlatlon . "\nZoom level: " . $zoom . "\n\n" . $feedback . "\n\n");
                fclose($file);
            }
            echo "<br><h1 style='text-align:center'>Thank you for your feedback!</h1>";
        } else {
            $file = fopen('feedback/spam.txt', 'a');
            fwrite($file, "-----\n\nDate: " . $date . "\nContact: " . $email . "\nLocation clicked: " . $userlatlon . "\nLocation of map view: " . $mapviewlatlon . "\nZoom level: " . $zoom . "\n\n" . $feedback . "\n\n");
            fclose($file);
        }
    }
    if (!empty($_POST["palaute"])) {
        $feedback = test_input($_POST["palaute"]);
        $userlatlon = test_input($_POST["userlatlon_fi"]);
        $mapviewlatlon = test_input($_POST["mapviewlatlon_fi"]);
        $zoom = test_input($_POST["zoomlevel_fi"]);
        $date = test_input($_POST["date_fi"]);
        $email = test_input($_POST["sposti"]);

        if (strncmp($date, '20', 2) == 0) {
            if (!empty($_POST["userIP_fi"])) {
                $ip = test_input($_POST["userIP_fi"]);
                $file = fopen('feedback/'  . $ip .  '.txt', 'a');
                fwrite($file, "-----\n\nDate: " . $date . "\nContact: " . $email . "\nLocation clicked: " . $userlatlon . "\nLocation of map view: " . $mapviewlatlon . "\nZoom level: " . $zoom . "\n\n" . $feedback . "\n\n");
               fclose($file);
            } else {
                $file = fopen('feedback/feedback.txt', 'a');
                fwrite($file, "-----\n\nDate: " . $date . "\nContact: " . $email . "\nLocation clicked: " . $userlatlon . "\nLocation of map view: " . $mapviewlatlon . "\nZoom level: " . $zoom . "\n\n" . $feedback . "\n\n");
                fclose($file);
            }
            echo "<br><h1 style='text-align:center'>Kiitos palautteestasi!</h1>";
        } else {
            $file = fopen('feedback/spam.txt', 'a');
            fwrite($file, "-----\n\nDate: " . $date . "\nContact: " . $email . "\nLocation clicked: " . $userlatlon . "\nLocation of map view: " . $mapviewlatlon . "\nZoom level: " . $zoom . "\n\n" . $feedback . "\n\n");
            fclose($file);
        }
    }
}

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  $data = wordwrap($data,100);
  return $data;
}
?>