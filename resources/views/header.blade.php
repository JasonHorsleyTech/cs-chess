<div class="flex w-full h-16 bg-gray-800">
    <a class="relative flex h-full w-48 items-center justify-center group" href="{{ url('/') }}">
        <div class="h-full py-2 mr-4">
            <img class="max-h-full" src="assets/logo.png" />
        </div>
        <span class="{{ Request::is('/') ? 'text-green-500' : 'text-white' }}">{{ config('app.name') }}</span>
        <div class="absolute w-0 bottom-0 h-1 bg-green-500 transition-fast group-hover:w-full"></div>
    </a>

    <div class="flex-grow"></div>

    @guest
        <a 
            class="relative flex h-full w-32 items-center justify-center group" 
            href="{{ route('login') }}"
        >
            <span class="{{ Request::is('login') ? 'text-green-500' : 'text-white' }}">{{ __('Login') }}</span>
            <div class="absolute w-0 bottom-0 h-1 bg-green-500 transition-fast group-hover:w-full"></div>
        </a>

        @if (Route::has('register'))
            <a 
                class="relative flex h-full w-32 items-center justify-center group" 
                href="{{ route('register') }}"
            >
                <span class="{{ Request::is('register') ? 'text-green-500' : 'text-white' }}">{{ __('Register') }}</span>
                <div class="absolute w-0 bottom-0 h-1 bg-green-500 transition-fast group-hover:w-full"></div>
            </a>
        @endif
    @else
        <a 
            class="relative flex h-full w-32 items-center justify-center group" 
            href="{{ route('account') }}"
        >
            <span class="{{ Request::is('account') ? 'text-green-500' : 'text-white' }}">{{ ucfirst(Auth::user()->name) }}</span>
            <div class="absolute w-0 bottom-0 h-1 bg-blue-500 transition-fast group-hover:w-full"></div>
        </a>
        
        <form id="logout-form" class="hidden" action="{{ route('logout') }}" method="POST">@csrf</form>
        <a 
            class="relative flex h-full w-32 items-center justify-center group" 
            href="{{ route('logout') }}"
            onclick="event.preventDefault();document.getElementById('logout-form').submit();"
        >
            <span class="text-white">{{ __('Logout') }}</span>
            <div class="absolute w-0 bottom-0 h-1 bg-red-400 transition-fast group-hover:w-full"></div>
        </a>

    @endguest
</div>
