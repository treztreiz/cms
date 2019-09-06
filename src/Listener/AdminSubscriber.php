<?php
namespace App\Listener;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\EventDispatcher\GenericEvent;
use Symfony\Component\Security\Core\Security;
use App\Entity\Author;
use App\Entity\Page;

class AdminSubscriber implements EventSubscriberInterface
{	
	private $security;

	public function __construct(Security $security)
    {
        $this->security = $security;
    }

	public static function getSubscribedEvents()
    {	    	
        return array(
            'easy_admin.pre_persist' => ['updateAuthor', 'updateUserPassword'],
            'easy_admin.pre_update' => ['updateAuthor', 'updateUserPassword'],
        );
    }

    public function updateAuthor(GenericEvent $event)
    {	
    	$entity = $event->getSubject();

    	if(!method_exists($entity,'getAuthor')) return;

    	$author = $entity->getAuthor();
    	if(null == $author){
    		$author = new Author();
    		$entity->setAuthor( $author );
    	}

    	$user = $this->security->getUser();
    	$author->setModifiedBy( $user->getUsername() );
        $author->setModifiedAt( new \DateTime() );

    	$event['entity'] = $entity;

    }

    public function updateUserPassword(GenericEvent $event){

        $entity = $event->getSubject();
        
        if(!($entity instanceof User)) return;
        
        throw new Exception("Error Processing Request", 1);
    }
}