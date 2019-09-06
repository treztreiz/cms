<?php

namespace App\Controller\Admin;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

use App\Entity\User;
use App\Form\AdminProfileType;

/**
 * @Route("/admin/profile")
 */
class ProfileController extends AdminController
{
    /**
     * @Route("/", name="admin.profile", methods={"GET"})
     */
    public function profile(): Response
    {   
        $user = $this->getUser();
        return $this->render('admin/profile/profile.html.twig', [
            'user' => $user,
        ]);
    }

    /**
     * @Route("/edit", name="admin.profile.edit", methods={"GET","POST"})
     */
    public function edit(Request $request): Response
    {   
        $user = $this->getUser();

        $form = $this->createForm(AdminProfileType::class, $user, [
            'adminLocales' => $this->getParameter('admin_locales')
        ]);
        $form->handleRequest($request);  
        if ($form->isSubmitted() && $form->isValid()) {

            $this->getDoctrine()->getManager()->flush();

            //Update session to automatically switch admin locale
            if (null !== $user->getLocale()) {
                $request->getSession()->set('_locale', $user->getLocale());
            }

            return $this->redirectToRoute('admin.profile');
            
        }

        return $this->render('admin/profile/edit.html.twig', [
            'user' => $user,
            'form' => $form->createView(),
        ]);
    }

}
