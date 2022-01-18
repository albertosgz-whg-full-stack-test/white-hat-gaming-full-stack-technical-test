<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProviderCollection;
use App\Models\Provider;
use Illuminate\Http\Request;

class ProviderController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return ProviderCollection
     */
    public function __invoke(Request $request, $id)
    {
        return ProviderCollection([Provider::find($id)]);
    }
}
