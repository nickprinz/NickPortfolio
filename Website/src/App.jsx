import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HomeLayout from './Home/HomeLayout';
import ErrorPage from './Home/ErrorPage';
import HomePage from './Home/HomePage';
import RedBlackTreeApp from './RedBlackTree/RedBlackTreeApp';
import PaletteMakerApp from './PaletteMaker/PaletteMakerApp';


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
    // { path: "events", element:<EventsLayout></EventsLayout>,
    //   children:[
    //     { index: true, element:<EventsPage></EventsPage>, loader: eventsLoader },
    //     { path: "new", element:<NewEventPage></NewEventPage>, action: editEventAction },
    //     { 
    //       path: ":eventId",
    //       id: "event-detail",
    //       loader: eventDetailLoader,
    //       children:[
    //         { index:true, element:<EventDetailPage></EventDetailPage>, action: deleteEventAction, },
    //         { path: "edit", element:<EditEventPage></EditEventPage>, action:editEventAction},

    //       ],
    //     },
    //     {},

    //   ]
    // },
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
  const [count, setCount] = useState(0)
  //document.body.setAttribute("class", "bg-gray-900")
  const testclass = <div className='rounded-xl border- border-b-emerald-800 w-48'></div>

  return <RouterProvider router={router}></RouterProvider>;
  return (
    <>
    <div className="">
      <div className='p-4 pt-10 '>
        <h1 className='text-center text-slate-300 text-5xl font-extrabold font-mono'>Nick Prinz</h1>
      </div>
      <div className='flex flex-col items-center gap-6 p-10 pt-2 m-10 mt-4'>
        <h2 className='text-center text-slate-300 text-2xl font-extrabold font-mono'>Projects</h2>
        <div className='flex gap-x-6 items-center flex-row'>
          <div className={appBoxClass} > Red Black Tree</div>
          <div className={appBoxClass} ></div>
        </div>
        <div className='flex gap-x-6'>
          <div className={appBoxClass} ></div>
          <div className={appBoxClass} ></div>
        </div>
        <div className='flex gap-x-6'>
          <div className={appBoxClass} ></div>
          <div className={appBoxClass} ></div>
        </div>
      </div>

    </div>
    </>
  )
}

export default App
