<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

use App\Entity\User;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserFixtures extends Fixture
{	
	private $passwordEncoder;

	public function __construct(UserPasswordEncoderInterface $passwordEncoder)
	{
		$this->passwordEncoder = $passwordEncoder;
	}
	
    public function load(ObjectManager $manager)
    {
        $admin = new User();

        $admin->setEmail('admin@admin.com')
        ->setFirstname('ADMIN')
        ->setLastname('admin')
        ->setUsername('admin')
        ->setPassword($this->passwordEncoder->encodePassword(
        	$admin,
        	'123456'
        ))
        ->setRoles(['ROLE_SUPER_ADMIN']);

        $manager->persist($admin);
        $manager->flush();
    }
}