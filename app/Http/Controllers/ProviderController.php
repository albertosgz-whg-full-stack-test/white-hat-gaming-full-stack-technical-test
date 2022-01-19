<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProviderResource;
use App\Models\Provider;
use Illuminate\Http\Request;

class ProviderController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return ProviderResource
     */
    public function __invoke(Request $request, $id)
    {
        return new ProviderResource(Provider::find($id));
    }
}
