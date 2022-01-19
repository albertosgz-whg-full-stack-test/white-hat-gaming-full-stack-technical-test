<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Provider extends Model
{
    use HasFactory;

    protected $table = 'game_providers';
    public $timestamps = false;

    /**
     * @return HasMany
     */
    public function games(): HasMany
    {
        return $this->hasMany(Game::class, 'game_provider_id');
    }
}
