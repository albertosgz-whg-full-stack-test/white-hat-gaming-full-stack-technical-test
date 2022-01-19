<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class GameResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'launchcode' => $this->launchcode,
            'name' => $this->name,
            'game_provider_id' => $this->game_provider_id,
            'rtp' => (float) $this->rtp,
            'brand_id' => $this->brandid,
            'category' => $this->category,
            'hot' => (bool) $this->hot,
            'new' => (bool) $this->new,
        ];
    }
}
