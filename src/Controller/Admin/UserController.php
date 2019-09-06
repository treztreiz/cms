<?php

namespace App\Controller\Admin;

use App\Entity\User;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Core\Authorization\AccessDecisionManagerInterface;

class UserController extends AdminController
{
    private $passwordEncoder;
    private $authChecker;
    private $decisionManager;

    public function __construct(UserPasswordEncoderInterface $passwordEncoder, AuthorizationCheckerInterface $authChecker, AccessDecisionManagerInterface $decisionManager)
    {
        $this->passwordEncoder = $passwordEncoder;
        $this->authChecker = $authChecker;
        $this->decisionManager = $decisionManager;
    }

    public function editAction()
    {   
        //Get user subject and test if is granted
        $id = $this->request->query->get('id');
        $userSubject = $this->em->getRepository(User::class)->find($id);
        $token = new UsernamePasswordToken($userSubject, 'none', 'none', $userSubject->getRoles());
        $isGranted = $this->decisionManager->decide($token, [ $this->getUser()->getRole() ] );

        //If usersubject is granted but current user is not, redirect
        if($isGranted && !$this->isGranted( $userSubject->getRole() )) return $this->redirectToRoute('admin.dashboard');

        return parent::editAction();
    }

    public function persistEntity($entity)
    {
        $this->encodePassword($entity);
        parent::persistEntity($entity);
    }

    public function updateEntity($entity)
    {
        $this->encodePassword($entity);
        parent::updateEntity($entity);
    }

    public function encodePassword($user)
    {
        if (!$user instanceof User) {
            return;
        }

        $user->setPassword(
            $this->passwordEncoder->encodePassword($user, $user->getPassword())
        );
    }
}