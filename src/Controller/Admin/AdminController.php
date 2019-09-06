<?php

namespace App\Controller\Admin;

use AlterPHP\EasyAdminExtensionBundle\Controller\EasyAdminController as BaseAdminController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

use App\Entity\Page;

class AdminController extends BaseAdminController
{      
    /**
     * @Route("/dashboard", name="admin.dashboard")
     */
    public function dashboard()
    {   
        return $this->render('admin/dashboard.html.twig');
    }

    public function showPageAction()
    {   
        $id = $this->request->query->get('id');
        $page = $this->em->getRepository(Page::class)->find($id);
        
        if( null == $page ) throw new NotFoundHttpException();
        
        return $this->redirectToRoute('page',[
            'slug' => $page->getSlug()
        ]);
    }
    
}