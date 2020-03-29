<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Scripts -->
    <script src="{{ asset('js/app.js') }}" defer></script>

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Share+Tech+Mono|Source+Code+Pro&display=swap" rel="stylesheet">

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
</head>
<body class="f-source bg-gray-200 min-h-screen flex flex-col">
    <div class="flex-shrink-0">
        @include('header')
    </div>

    <div class="flex-grow mx-auto">
        @yield('content')
    </div>

    <div class="flex-shrink-0">
        @include('footer')
    </div>
</body>
</html>
