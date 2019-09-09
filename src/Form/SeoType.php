<?php

namespace App\Form;

use App\Entity\Seo;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use A2lix\TranslationFormBundle\Form\Type\TranslationsType;

class SeoType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('translations', TranslationsType::class, [ 
                'fields' => [
                    'ogTitle' => [ 'label' => 'seo.og_title' ],
                    'ogDescription' => [ 'label' => 'seo.og_description']
                ]
            ])
            ->add('indexed', null, [
                "required" => false,
                "label" => 'page.indexed'
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Seo::class,
        ]);
    }
}