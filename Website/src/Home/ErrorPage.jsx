import { useRouteError } from "react-router-dom";

export default function ErrorPage(){
    const error = useRouteError();
    let title = "";
    let message = "";

    if(error.status === 500){
        message = error.data.message;
    }

    if(error.status === 404){
        title = "Didnt find page";
        message = "This is not a real page";
    }


    return<>
        <p>{message}</p>
    </> ;
}