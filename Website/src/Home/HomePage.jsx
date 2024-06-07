
export default function HomePage(){

    document.body.setAttribute("class", "bg-gray-900")
    const testclass = <div className='rounded-xl border- border-b-emerald-800 w-48'></div>

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