@extends('layouts.app')

@section('content')
    <div class="bg-white w-5/6 md:w-3/4 lg:w-2/3 xl:w-1/2 block mx-auto my-8 rounded-lg shadow">
        <div class="w-full border-b border-gray-200 text-center">
            <div class="align-baseline inline-block fs-32 fw-800 py-4 text-gray-900">{{ __('Register') }}</div>
        </div>

        <form class="relative mt-2" method="POST" action="{{ route('register') }}">
            @csrf
            <div class="flex flex-wrap w-full">

                {{-- NAME --}}
                <div class="w-full lg:w-1/2 px-4 md:px-16 lg:px-8 my-2">
                    <div class="w-full">
                        <label for="name" class="">{{ __('Name') }}</label>
                        <input 
                            class="w-full rounded border border-black bg-gray-300 px-2 py-1 @error('name') border-red-500 @enderror" 
                            id="name" 
                            type="text" 
                            name="name" 
                            required
                            value="{{ old('name') }}" 
                            autocomplete="name"
                            autofocus
                        >
                        @error('name')
                            <span class="fs-12 text-red-700" role="alert">{{ $message }}</span>
                        @enderror
                    </div>
                </div>

                {{-- EMAIL --}}
                <div class="w-full lg:w-1/2 px-4 md:px-16 lg:px-8 my-2">
                    <div class="w-full">
                        <label for="email" class="">{{ __('Email') }}</label>
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

                {{-- PASSWORD --}}
                <div class="w-full lg:w-1/2 px-4 md:px-16 lg:px-8 my-2">
                    <div class="w-full">
                        <label for="password" class="">{{ __('Password') }}</label>
                        <input 
                            class="w-full rounded border border-black bg-gray-300 px-2 py-1 @error('password') border-red-500 @enderror" 
                            id="password" 
                            type="password" 
                            name="password" 
                            required
                            value="{{ old('password') }}" 
                            autocomplete="new-password"
                            autofocus
                        >
                        @error('password')
                            <span class="fs-12 text-red-700" role="alert">{{ $message }}</span>
                        @enderror
                    </div>
                </div>

                {{-- PASSWORD --}}
                <div class="w-full lg:w-1/2 px-4 md:px-16 lg:px-8 my-2">
                    <div class="w-full">
                        <label for="password-confirm" class="">{{ __('Comfirm Password') }}</label>
                        <input 
                            class="w-full rounded border border-black bg-gray-300 px-2 py-1 @error('password-confirm') border-red-500 @enderror" 
                            id="password-confirm" 
                            type="password" 
                            name="password_confirmation" 
                            required
                            value="{{ old('password-confirm') }}" 
                            autocomplete="new-password"
                            autofocus
                        >
                        @error('password-confirm')
                            <span class="fs-12 text-red-700" role="alert">{{ $message }}</span>
                        @enderror
                    </div>
                </div>

            </div>

            <div class="w-full h-8 mt-4 relative">
                <div class="absolute mt-3 w-full text-center">
                    <button type="submit" class="h-10 mx-auto block bg-green-500 px-4 py-2 text-white rounded
                        hover:bg-green-600 hover:-mt-px transform-fast">
                        {{ __('Register') }}
                    </button>
                </div>
            </div>

        </form>
    </div>
@endsection
