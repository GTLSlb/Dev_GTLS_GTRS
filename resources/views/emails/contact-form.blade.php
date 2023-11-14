<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Contact Form Submitted</title>
</head>
<body>
    <h2>job application</h2>
    <p>Name: {{ $data['name'] }}</p>
    <p>Email: {{ $data['email'] }}</p>
    <p>Phone: {{ $data['phone'] }}</p>
    <p>Message: {{ $data['message'] }}</p>
    @if ($data['pdf'])
        <p>PDF Attachment: <a href="{{ asset('pdf/'.$data['pdf']) }}">Download</a></p>
    @endif
</body>
</html>