<?php

namespace App\Entity\Traits;

use App\Entity\Author;

trait TraitAuthor
{
	/**
     * @ORM\OneToOne(targetEntity="App\Entity\Author", cascade={"all"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $author;

    public function getAuthor(): ?Author
    {
        return $this->author;
    }

    public function setAuthor(Author $author): self
    {
        $this->author = $author;

        return $this;
    }
}