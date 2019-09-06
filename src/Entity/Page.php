<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Knp\DoctrineBehaviors\Model as ORMBehaviors;

/**
 * @ORM\Entity(repositoryClass="App\Repository\PageRepository")
 */
class Page
{   
    use ORMBehaviors\Translatable\Translatable;
    use Traits\TraitAuthor;
    use Traits\TraitImage;
    use Traits\TraitSeo;
    
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $css;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $assets;

    /**
     * @ORM\Column(type="boolean")
     */
    private $frontpage = false;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFrontpage(): ?bool
    {
        return $this->frontpage;
    }

    public function setFrontpage(bool $frontpage): self
    {
        $this->frontpage = $frontpage;

        return $this;
    }

    public function getCss(): ?string
    {
        return $this->css;
    }

    public function setCss(?string $css): self
    {
        $this->css = $css;

        return $this;
    }

       public function getAssets(): ?string
    {
        return $this->assets;
    }

    public function setAssets(?string $assets): self
    {
        $this->assets = $assets;

        return $this;
    }

    /* TRANSLATE FUNCTIONS */
    public function getTitle() {
        return $this->translate()->getTitle();
    }

    public function getSubtitle() {
        return $this->translate()->getSubtitle();
    }

    public function getSlug() {
        return $this->translate()->getSlug();
    }

    public function getHtml() {
        return $this->translate()->getHtml();
    }

}