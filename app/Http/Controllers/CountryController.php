<?php

namespace App\Http\Controllers;

use App\Http\Resources\CountryCollection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CountryController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return CountryCollection
     */
    public function __invoke(Request $request)
    {
        $query = DB::table('countries')
            ->select([
                'countries.code',
                'countries.country',
            ]);

        $filter = $request->get('filter');
        if ($filter) {
            $query->where('country', 'like', "%{$filter}%");
        }

        return new CountryCollection($query->simplePaginate(10));

    }
}
