<?php

namespace App\Http\Controllers;

use App\Http\Resources\BrandCollection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BrandController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return BrandCollection
     */
    public function __invoke(Request $request)
    {
        $query = DB::table('brands')
            ->select([
                'brands.id',
                'brands.brand',
            ])
            ->join('brand_games', 'brand_games.brandid', '=', 'brands.id')
            ->join('game', 'game.launchcode', '=', 'brand_games.launchcode')
            ->where('brands.id', '!=', 0)
            ->whereNotNull('game.launchcode')
            ->groupBy('brands.id');

        return new BrandCollection($query->simplePaginate(10));
    }
}
