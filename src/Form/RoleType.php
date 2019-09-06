<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

class RoleType extends ChoiceType
{	
	private $authChecker;
	private $resolver;
 	
 	private $choiceListFactory;

    public function __construct(ChoiceListFactoryInterface $choiceListFactory = null, AuthorizationCheckerInterface $authChecker)
    {	
    	parent::__construct($choiceListFactory);
    	$this->authChecker = $authChecker;
    }

	public function configureOptions(OptionsResolver $resolver)
    {	
  
    	parent::configureOptions($resolver);
    	$options = array_merge( $resolver->getDefinedOptions(), [ 'roles' => null ] );
    	$resolver->setDefaults( $options );

    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {	
    	$roles = $options['roles'];
    	$choices = [];
    	foreach($roles as $role => $subroles){
    		if($this->authChecker->isGranted($role)) $choices[$role] = $role; 
    	}
    	$options['choices'] = $choices;

    	parent::buildForm($builder, $options);
    }

}