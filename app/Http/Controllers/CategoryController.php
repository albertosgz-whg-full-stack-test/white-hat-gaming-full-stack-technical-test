<?php

namespace App\Http\Controllers;

use App\Http\Resources\BrandCollection;
use App\Http\Resources\CategoryCollection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return CategoryCollection
     */
    public function __invoke(Request $request)
    {
        $query = DB::table('brand_games')
            ->select(['brand_games.category',])
            ->join('game', 'brand_games.launchcode', '=', 'game.launchcode')
            ->distinct();

        return new CategoryCollection($query->simplePaginate(10));

    }
}
