<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Game extends Model
{
    use HasFactory;

    protected $primaryKey = 'launchcode';
    protected $keyType = 'string';
    protected $table = 'game';
    public $timestamps = false;
    public $incrementing = false;

    protected $casts = [
        'rtp' => 'float',
    ];

    /**
     * @return BelongsTo
     */
    public function provider(): BelongsTo
    {
        return $this->belongsTo(Provider::class, 'game_provider_id');
    }
}
