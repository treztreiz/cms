<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Knp\DoctrineBehaviors\Model as ORMBehaviors;

/**
 * @ORM\Entity(repositoryClass="App\Repository\SeoRepository")
 */
class Seo
{   
    use ORMBehaviors\Translatable\Translatable;

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="boolean")
     */
    private $indexed;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIndexed(): ?bool
    {
        return $this->indexed;
    }

    public function setIndexed(bool $indexed): self
    {
        $this->indexed = $indexed;

        return $this;
    }
    
    /* TRANSLATE FUNCTIONS */

    public function getOgTitle()
    {
        return $this->translate()->getOgTitle();
    }

    public function getOgDescription()
    {
        return $this->translate()->getOgDescription();
    }
}