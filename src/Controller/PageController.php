<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

use App\Entity\Page;
use App\Repository\PageRepository;

class PageController extends AbstractController
{   

    /**
     * @Route("/", name="frontpage")
     */
    public function frontpage(PageRepository $pageRepository)
    {
        $page = $pageRepository->findOneByFrontpage(true);
        if( null == $page ) throw new NotFoundHttpException();

        return $this->render('page/page.html.twig',[
            "page" => $page
        ]);
    }

    /**
     * @Route("/{slug}", name="page")
     */
    public function page(Request $request, PageRepository $pageRepository, $slug)
    {   
        $page = $pageRepository->getPage($slug, $request->getLocale() );
        dump($request->getLocale());
        if( null == $page ) throw new NotFoundHttpException();
        elseif( $page->getFrontpage() ) return $this->redirectToRoute('frontpage', [], 301);

        return $this->render('page/page.html.twig',[
            "page" => $page
        ]);
    }

    /**
     * @Route("/{id}/{slug}", name="page.by_id")
     */
    public function pageById(Page $page)
    {   
        if( null == $page ) throw new NotFoundHttpException();
        
        return $this->redirectToRoute('page',[
            'slug' => $page->getSlug()
        ], 301);
    }
}