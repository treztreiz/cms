<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Knp\DoctrineBehaviors\Model as ORMBehaviors;

/**
 * @ORM\Entity
 */
class SeoTranslation
{   
    use ORMBehaviors\Translatable\Translation;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $ogTitle;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $ogDescription;

    public function getOgTitle(): ?string
    {
        return $this->ogTitle;
    }

    public function setOgTitle(?string $ogTitle): self
    {
        $this->ogTitle = $ogTitle;

        return $this;
    }

    public function getOgDescription(): ?string
    {
        return $this->ogDescription;
    }

    public function setOgDescription(string $ogDescription): self
    {
        $this->ogDescription = $ogDescription;

        return $this;
    }
}
