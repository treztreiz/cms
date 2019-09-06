<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Authorization\AccessDecisionManagerInterface;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Core\Security;

use App\Entity\User;

class RoleType extends ChoiceType
{	
	private $authChecker;
    private $security;
    private $decisionManager;

    public function __construct(ChoiceListFactoryInterface $choiceListFactory = null, AuthorizationCheckerInterface $authChecker, Security $security, AccessDecisionManagerInterface $decisionManager)
    {	
    	parent::__construct($choiceListFactory);
    	$this->authChecker = $authChecker;
        $this->decisionManager = $decisionManager;
        $this->security = $security;
    }

	public function configureOptions(OptionsResolver $resolver)
    {	
    	parent::configureOptions($resolver);
    	$options = array_merge( $resolver->getDefinedOptions(), [ 'roles' => null ] );
    	$resolver->setDefaults( $options );
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {	
        $options['choices'] = $this->getRoles( $options['roles'], $this->security->getUser() );
    	parent::buildForm($builder, $options);
    }

    public function getRoles($roles, $user)
    {   
        $choices = [];
        foreach($roles as $role => $subroles){
            if($this->authChecker->isGranted($role)) $isGranted = true; 
            else{
                $token = new UsernamePasswordToken($user, 'none', 'none', [ $role ] );
                $this->decisionManager->decide($token, [ $user->getRole() ]) ? $isGranted = false : $isGranted = true;
            }
            if($isGranted) $choices[$role] = $role; 
        }
        
        return $choices;
    }

}