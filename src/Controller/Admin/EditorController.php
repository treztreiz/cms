<?php

namespace App\Controller\Admin;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

use App\Entity\Page;
use App\Entity\Image;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Vich\UploaderBundle\Templating\Helper\UploaderHelper;

/**
 * @Route("/editor")
 */
class EditorController extends AbstractController
{      
    /**
     * @Route("/asset/upload", name="admin.asset_upload", options={ "expose": true })
     */
    public function assetUpload(Request $request, ValidatorInterface $validator, UploaderHelper $helper)
    {   
        $em = $this->getDoctrine()->getManager();

        $assets = [];
        $errors = [];
        $files = $request->files->get('files');

        for($i=0; $i < count($files); $i++){

            $file = $files[$i];

            $uploadedFile = new Image();
            $uploadedFile->setImageFile($file);

            $violations = $validator->validate($uploadedFile)->getIterator();
            if( count($violations) > 0 ){

                foreach($violations as $violation){
                    if(!isset( $errors[$i] )){
                        $errors[$i] = [ 
                            "filename" => $violation->getRoot()->getImageFile()->getClientOriginalName(),
                            "violations" => []
                        ];
                    }
                    $errors[$i]["violations"][] = $violation->getMessage();
                }

            }else{

                $assets[] = $uploadedFile;
                $em->persist($uploadedFile);

            }

        }
        $em->flush();

        $response = [ "assets" => [], "errors" => $errors ];
        foreach($assets as $asset){
            $response["assets"][] = $helper->asset($asset, 'imageFile');
        }

        return new JsonResponse($response);
    }

    /**
     * @Route("/pages/link", name="admin.pages_link", options={ "expose": true })
     */
    public function getPagesLink(Request $request)
    {   
        $em = $this->getDoctrine()->getManager();
        $pages = $em->getRepository(Page::class)->findAll();

        $response[] = [ "value" => "none", "name" => "None" ];
        foreach($pages as $page){
            $response[] = [ 
                "value" => "{{path('page.by_id',{ id : " . $page->getId() . ", slug : '" . $page->getSlug() . "' })}}",
                "name" => $page->getTitle()
            ];
        }

        return new JsonResponse($response);
    }
    
}