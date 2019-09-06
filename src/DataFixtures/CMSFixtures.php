<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

use App\Entity\User;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use App\Entity\Author;
use App\Entity\Seo;
use App\Entity\Page;

class CMSFixtures extends Fixture implements ContainerAwareInterface
{	
    private $container;
    private $em;
    private $passwordEncoder;
    private $admin;

    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {   
        $this->passwordEncoder = $passwordEncoder;
    }

    //Inject container to retrieve service parameters
    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }

    private function getParameter($parameter)
    {
        return $this->container->getParameter($parameter);
    }

    public function load(ObjectManager $em)
    {   
        $this->em = $em;

        $this->createAdmin();
        $this->createFrontpage();

        $this->em->flush();
    }

    public function createAdmin()
    {   
        //Create admin user by injecting data from service parameters
        $this->admin = new User();
        $this->admin->setEmail( $this->getParameter('admin_email') )
        ->setFirstname( $this->getParameter('admin_firstname') )
        ->setLastname( $this->getParameter('admin_lastname') )
        ->setUsername( $this->getParameter('admin_username') )
        ->setPassword($this->passwordEncoder->encodePassword( //Encode password
            $this->admin,
            $this->getParameter('admin_password')
        ))
        ->setRoles(['ROLE_SUPER_ADMIN']); //Set SUPER ADMIN role

        $this->em->persist($this->admin);
    }

    public function createFrontpage()
    {   
        //Create frontpage
        $frontpage = new Page();

        //Add author
        $author = new Author();
        $author->setModifiedBy( $this->admin );
        $frontpage->setAuthor( $author );

        //Add seo
        $seo = new Seo();
        $frontpage->setSeo($seo);

        //Set title for every locales set in service parameters
        $locales = $this->getParameter('locales');
        foreach($locales as $locale){
            $frontpage->translate($locale)->setTitle('Frontpage');
        }
        $frontpage->mergeNewTranslations();

        $this->em->persist($frontpage);
    }
}