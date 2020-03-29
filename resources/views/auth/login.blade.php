@extends('layouts.app')

@section('content')
    <div class="bg-white w-5/6 md:w-3/4 lg:w-2/3 xl:w-1/2 block mx-auto my-8 rounded-lg shadow">
        <div class="w-full border-b border-gray-200 text-center">
            <div class="align-baseline inline-block fs-32 fw-800 py-4 text-gray-900">{{ __('Login') }}</div>
        </div>

        <form class="relative mt-8" method="POST" action="{{ route('login') }}">
            @csrf
            <div class="flex flex-wrap w-full">

                <div class="w-full md:w-1/2 px-4">
                    <div class="w-full">
                        <label for="email" class="">{{ __('E-Mail Address') }}</label>
                        <input 
                            class="w-full rounded border border-black bg-gray-300 px-2 py-1 @error('email') border-red-500 @enderror" 
                            id="email" 
                            type="email" 
                            name="email" 
                            required
                            value="{{ old('email') }}" 
                            autocomplete="email"
                            autofocus
                        >
                        @error('email')
                            <span class="fs-12 text-red-700" role="alert">{{ $message }}</span>
                        @enderror
                    </div>
                </div>

                <div class="w-full md:w-1/2 px-4">
                    <label for="password" class="">{{ __('Password') }}</label>
                    <input 
                        class="w-full rounded border border-black bg-gray-300 px-2 py-1 @error('password') border-red-500 @enderror" 
                        id="password" 
                        type="password" 
                        name="password" 
                        required 
                        autocomplete="current-password"
                    >
                    @error('password')
                        <span class="fs-12 text-red-700" role="alert">{{ $message }}</span>
                    @enderror
                </div>

                @if (Route::has('password.request'))
                    <div class="w-full text-right pr-4 my-4">
                        <a class="text-purple-700 hover:underline" href="{{ route('password.request') }}">
                            {{ __('Forgot Your Password?') }}
                        </a>
                    </div>
                @endif

            </div>

            <div class="w-full h-8 relative">
                <div class="absolute mt-3 w-full text-center">
                    <button type="submit" class="h-10 mx-auto block bg-green-500 px-4 py-2 text-white rounded
                        hover:bg-green-600 hover:-mt-px transform-fast">
                        {{ __('Login') }}
                    </button>
                </div>
            </div>

        </form>
    </div>
@endsection
