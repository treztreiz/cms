<?php

namespace App\Controller;

use EasyCorp\Bundle\EasyAdminBundle\Controller\AdminController as BaseAdminController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

use App\Entity\User;
use App\Form\AdminProfileType;


/**
 * @Route("/admin")
 */
class AdminProfileController  extends BaseAdminController
{
    /**
     * @Route("/profile", name="admin.profile", methods={"GET"})
     */
    public function profile(): Response
    {   
        $user = $this->getUser();
        return $this->render('admin/profile/profile.html.twig', [
            'user' => $user,
        ]);
    }

    /**
     * @Route("/profile/edit", name="admin.profile.edit", methods={"GET","POST"})
     */
    public function edit(Request $request): Response
    {   
        $user = $this->getUser();
        $form = $this->createForm(AdminProfileType::class, $user);
        $form->handleRequest($request);  

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            /*return $this->redirectToRoute('admin.profile');*/
            
        }

        return $this->render('admin/profile/edit.html.twig', [
            'user' => $user,
            'form' => $form->createView(),
        ]);
    }

}
