<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Contact Form Submitted</title>
</head>
<body>
    <h2>contacted through web</h2>
    <p>Name: {{ $data['name'] }}</p>
    <p>Company: {{ $data['company'] }}</p>
    <p>Email: {{ $data['email'] }}</p>
    <p>Phone: {{ $data['phone'] }}</p>
    <p>Message: {{ $data['message'] }}</p>
    
</body>
</html>