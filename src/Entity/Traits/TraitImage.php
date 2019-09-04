<?php

namespace App\Entity\Traits;

use App\Entity\Image;

trait TraitImage
{
    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Image", cascade={"persist"})
     */
    private $image;

    public function getImage(): ?Image
    {
        return $this->image;
    }

    public function setImage(?Image $image): self
    {
        $this->image = $image;

        return $this;
    }
}