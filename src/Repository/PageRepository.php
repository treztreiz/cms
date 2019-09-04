<?php

namespace App\Repository;

use App\Entity\Page;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method Page|null find($id, $lockMode = null, $lockVersion = null)
 * @method Page|null findOneBy(array $criteria, array $orderBy = null)
 * @method Page[]    findAll()
 * @method Page[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Page::class);
    }

    public function getPage($slug, $locale): ?Page
    {
        return $this->createQueryBuilder('p')
            ->leftJoin('p.translations','pt')
            ->andWhere('pt.slug = :slug')
            ->andWhere('pt.locale = :locale')
            ->setParameters([ 'slug' => $slug, 'locale' => $locale ])
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
}
