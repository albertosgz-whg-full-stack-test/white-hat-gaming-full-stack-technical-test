<?php

namespace Tests\Feature;

use App\Models\Game;
use App\Models\Provider;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class GameEndpointTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    public function test_get_games()
    {
        $code = $this->faker->uuid();
        DB::table('brand_games')->insert([
            'launchcode' => $code,
            'brandid' => 1,
            'category'=> $this->faker->word(),
            'hot'=> $this->faker->boolean(),
            'new'=> $this->faker->boolean(),
        ]);
        $provider = Provider::factory()->create();
        $game = Game::factory()
            ->for($provider)
            ->create(['launchcode' => $code]);

        $response = $this->get('/api/games?brand_id=1&country_id=1');

        $response->assertStatus(200)
            ->assertJsonFragment([
                'launchcode' => $code,
            ]);

        $data = $response->json();
        $this->assertCount(1, $data['data']);
        $this->assertEquals($code, $data['data'][0]['launchcode']);
    }

    public function test_get_game_blocked_by_country()
    {
        $code = $this->faker->uuid();
        DB::table('brand_games')->insert([
            'launchcode' => $code,
            'brandid' => 1,
            'category'=> $this->faker->word(),
            'hot'=> $this->faker->boolean(),
            'new'=> $this->faker->boolean(),
        ]);
        $provider = Provider::factory()->create();
        $game = Game::factory()
            ->for($provider)
            ->create(['launchcode' => $code]);

        DB::table('game_country_block')->insert([
            'launchcode' => $code,
            'brandid' => 2,
            'country'=> 3,
        ]);

        $response = $this->get('/api/games?brand_id=2&country_id=3');

        $response->assertStatus(200);

        $data = $response->json();
        $this->assertCount(0, $data['data']);
    }

    public function test_get_game_blocked_by_country_and_brand_0()
    {
        $code = $this->faker->uuid();
        DB::table('brand_games')->insert([
            'launchcode' => $code,
            'brandid' => 1,
            'category'=> $this->faker->word(),
            'hot'=> $this->faker->boolean(),
            'new'=> $this->faker->boolean(),
        ]);
        $provider = Provider::factory()->create();
        $game = Game::factory()
            ->for($provider)
            ->create(['launchcode' => $code]);

        DB::table('game_country_block')->insert([
            'launchcode' => $code,
            'brandid' => 0,
            'country'=> 4,
        ]);

        $response = $this->get('/api/games?brand_id=1&country_id=4');

        $response->assertStatus(200);

        $data = $response->json();
        $this->assertCount(0, $data['data']);
    }

    public function test_get_game_blocked_by_brand()
    {
        $code = $this->faker->uuid();
        DB::table('brand_games')->insert([
            'launchcode' => $code,
            'brandid' => 1,
            'category'=> $this->faker->word(),
            'hot'=> $this->faker->boolean(),
            'new'=> $this->faker->boolean(),
        ]);
        $provider = Provider::factory()->create();
        $game = Game::factory()
            ->for($provider)
            ->create(['launchcode' => $code]);

        DB::table('game_brand_block')->insert([
            'launchcode' => $code,
            'brandid' => 5,
        ]);

        $response = $this->get('/api/games?brand_id=5&country_id=1');

        $response->assertStatus(200);

        $data = $response->json();
        $this->assertCount(0, $data['data']);
    }
}
