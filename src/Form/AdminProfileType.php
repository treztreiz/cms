<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use App\Form\ImageType;

class AdminProfileType extends AbstractType
{   
    private $adminLocales;

    public function buildForm(FormBuilderInterface $builder, array $options)
    {   
        $this->adminLocales = $options['adminLocales'];
        if( null == $this->adminLocales ) throw new \Exception("You must inject admin locales while instantiating the Admin Profile form", 1);

        $builder
            ->add('username')
            ->add('email')
            ->add('firstname')
            ->add('lastname')
            ->add('image', ImageType::class)
            ->add('locale', ChoiceType::class, [
                'choices' => array_flip ( $this->adminLocales )
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => User::class,
            'adminLocales' => null
        ]);
    }
}