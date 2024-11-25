<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="locale" property= "og:locale" content="en_US">
    <meta name="type" property= "og:type" content="website">
    <meta name="url" property="og:url" content="https://web.gtls.au" />
    <meta name="theme-color" content="#317EFB"/>
    <meta name="site_name" property="og:site_name" content="GTLS" />
    <meta name="image" property="og:image" content="{{ asset('favicon.ico') }}" />
    <meta name="title" property= "og:title" content="Gold Tiger Logistics Solutions">
    <meta name="description" property= "og:description"
        content="SMARTER SUPPLY CHAIN MANAGEMENTTHIRD PARTY LOGISTICS SPECIALISTS In case of Emergency or Breakdown contact 0450 033 222 Transport and logistics solutions tailored to your needs Gold Tiger Logistics Solutions partners with FMCG, food, packaging, manufacturing, retail, industrial and other companies who operate statewide or nationwide and often 24/7. No two customers are the same, so … Home Read More »">

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-0KMJRECLV1"></script>
    <script>
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());

        gtag('config', 'G-0KMJRECLV1');
    </script>
    <script>
        window.Laravel = {
            appId: "{{ env('REACT_APP_ID') }}",
            gtrsUrl: "{{ env('GTRS_API_URL') }}",
            gtccrUrl: "{{ env('GTCCR_API_URL') }}",
            gtamUrl: "{{ env('GTAM_API_URL') }}",
            appDomain: "{{ env('SESSION_DOMAIN') }}",
            gtrsWeb: "{{ env('GTRS_WEB_URL') }}",
            googleMapsKey: "{{ env('GOOGLE_MAPS_KEY') }}",
        };
    </script>
    <!-- resources/views/layouts/app.blade.php -->
    <title inertia>{{ config('app.name', 'GTLS') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!--Manifest-->
    <link rel="manifest" href="/manifest.json">
    <link rel="stylesheet" href="public/manifest.json" />

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased h-full bg-smooth">
    @inertia
</body>

</html>
