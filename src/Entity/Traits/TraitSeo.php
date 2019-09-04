<?php

namespace App\Entity\Traits;

use App\Entity\Seo;

trait TraitSeo
{
    /**
     * @ORM\OneToOne(targetEntity="App\Entity\Seo", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $seo;

    public function getSeo(): ?Seo
    {
        return $this->seo;
    }

    public function setSeo(Seo $seo): self
    {
        $this->seo = $seo;

        return $this;
    }
}