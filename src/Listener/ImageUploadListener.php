<?php
namespace App\Listener;

use Vich\UploaderBundle\Event\Event;
use Liip\ImagineBundle\Imagine\Cache\CacheManager;
use Vich\UploaderBundle\Templating\Helper\UploaderHelper;
use App\Entity\Image;

class ImageUploadListener
{

	private $cacheManager;
	private $uploaderHelper;

	public function __construct(CacheManager $cacheManager, UploaderHelper $uploaderHelper)
	{
	    $this->cacheManager = $cacheManager;
	    $this->uploaderHelper = $uploaderHelper;
	}

	public function onVichUploaderPreRemove(Event $event)
	{
	    $entity = $event->getObject();
	    
	    if(!$entity instanceof Image) {
	        return;
	    }
	    
	    $this->cacheManager->remove($this->uploaderHelper->asset($entity, 'imageFile'));
	}

}