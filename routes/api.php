<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['middleware' => ['cors']], function () {
    Route::get('/games', \App\Http\Controllers\GameController::class);
    Route::get('/brands', \App\Http\Controllers\BrandController::class);
    Route::get('/countries', \App\Http\Controllers\CountryController::class);
    Route::get('/categories', \App\Http\Controllers\CategoryController::class);
    Route::get('/provider/{id}', \App\Http\Controllers\ProviderController::class);
});
