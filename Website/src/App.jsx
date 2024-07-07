import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HomeLayout from './Home/HomeLayout';
import ErrorPage from './Home/ErrorPage';
import HomePage from './Home/HomePage';
import RedBlackTreeApp from './RedBlackTree/RedBlackTreeApp';
import PaletteMakerApp from './PaletteMaker/PaletteMakerApp';
import ProjectsPage from './Home/ProjectsPage';
import "./i18n/config.js";


//home
//  about
//  projects
//redblack
//palettemaker
//  paletteId
const router = createBrowserRouter([{
  path:"/",
  element:<HomeLayout></HomeLayout>,
  errorElement:<ErrorPage></ErrorPage>,
  children:[
    { index: true, element:<HomePage></HomePage>, },
    { path: "projects", element:<ProjectsPage></ProjectsPage>, },
  ],
},
{
  path:"/redblack",
  element:<RedBlackTreeApp></RedBlackTreeApp>,//will change these to be layout pages with redblack home index
},
{
  path:"/palette",
  element:<PaletteMakerApp></PaletteMakerApp>,
},
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App
