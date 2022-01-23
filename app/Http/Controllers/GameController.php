<?php

namespace App\Http\Controllers;

use App\Http\Resources\BrandCollection;
use App\Http\Resources\CountryCollection;
use App\Http\Resources\GameCollection;
use App\Models\Game;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GameController extends Controller
{

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return GameCollection
     */
    public function __invoke(Request $request)
    {
        $brandId = $request->get('brand_id');
        $countryId = $request->get('country_id');
        $category = $request->get('category');
        if (!$brandId) {
            throw new \Exception('Missing brand field');
        }
        if (!is_numeric($brandId)) {
            throw new \Exception('Unexpected Brand value type (must be numeric)');
        }
        if (!$countryId) {
            throw new \Exception('Missing country field');
        }

        $countryBlockTable = DB::table('game_country_block')
            ->select('launchcode')
            ->where(function($where) use ($brandId) {
                $where->where('brandid', $brandId)
                    ->orWhere('brandid', 0);
            })
            ->where('country', $countryId);

        $query = DB::table('game')
            ->select([
                'game.launchcode',
                'game.name',
                'game.game_provider_id',
                'game.rtp',
                'brand_games.brandid',
                'brand_games.category',
                'brand_games.hot',
                'brand_games.new',
            ])

            // Get brand info for game
            ->join('brand_games', function ($leftJoin) use ($brandId) {
                $leftJoin
                    ->on('brand_games.brandid', '=', DB::raw($brandId))
                    ->on('brand_games.launchcode', '=', 'game.launchcode');
            })

            // Get blocking info by brand
            ->leftJoin('game_brand_block', function ($leftJoin) use ($brandId) {
                $leftJoin
                    ->on('game_brand_block.brandid', '=', DB::raw($brandId))
                    ->on('game_brand_block.launchcode', '=', 'game.launchcode');
            })

            // Get blocking info by country
            ->leftJoinSub($countryBlockTable, 'blocked_games_by_country', function ($join) {
                $join->on('game.launchcode', '=', 'blocked_games_by_country.launchcode');
            })

            ->whereNull('game_brand_block.id') // Blocking brand
            ->whereNull('blocked_games_by_country.launchcode'); // Blocking country

        if ($category) {
            $query->where('brand_games.category', '=', $category);
        }

        $games = $query->simplePaginate(10);

        return new GameCollection($games);
    }
}
