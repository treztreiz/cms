<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Knp\DoctrineBehaviors\Model as ORMBehaviors;
use Cocur\Slugify\Slugify;

/**
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 */
class PageTranslation
{   
    use ORMBehaviors\Translatable\Translation;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $title;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $slug;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $subtitle;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $html;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $storage;

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getSlug(): string
    {   
        return $this->slug;
    }

    public function setSlug(string $title): self
    {   
        $this->slug = (new Slugify())->slugify($title);

        return $this;
    }

    public function getHtml(): ?string
    {
        return $this->html;
    }

    public function setHtml(?string $html): self
    {
        $this->html = $html;

        return $this;
    }

    public function getStorage(): ?string
    {
        return $this->storage;
    }

    public function setStorage(?string $storage): self
    {
        $this->storage = $storage;

        return $this;
    }

    public function getSubtitle(): ?string
    {
        return $this->subtitle;
    }

    public function setSubtitle(?string $subtitle): self
    {
        $this->subtitle = $subtitle;

        return $this;
    }

    /**
     * @ORM\PrePersist
     * @ORM\PreUpdate
     */
    public function hydratePage()
    {     
        $storage = @json_decode($this->storage);

        if( null !== $storage && isset($storage->{'gjs-html'}) ){  
            $this->setHtml($storage->{'gjs-html'});
        }
    }

    /**
     * @ORM\PrePersist
     * @ORM\PreUpdate
     */
    public function updateSlug()
    {
        $this->setSlug( $this->title );
    }
    
}