<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Contact Form Submitted</title>
</head>
<body>
    <h2>Support Application</h2>
    <p>Subject: {{ $data['subject'] }}</p>
    <p>Name: {{ $data['name'] }}</p>
    <p>Email: {{ $data['email'] }}</p>
    <p>Message: {{ $data['message'] }}</p>

    @if ($data['attachment'])
        <p>Attachment: <a href="{{ asset('uploads/'.$data['attachment']) }}">Download</a></p>
    @endif
</body>
</html>