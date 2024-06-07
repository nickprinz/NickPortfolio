import ProjectCard from "./ProjectCard";

export default function ProjectsPage(){
    //instead of manually defining rows, will read name, url, image data to map to ProjectCard
    return (
        <>
          <div className='flex flex-col items-center gap-6 p-10 pt-2 m-10 mt-4'>
            <a  href="https://github.com/nickprinz/NickPortfolio/tree/main" target="_blank" rel="noreferrer noopener" className='text-center text-slate-300 text-lg font-extrabold font-mono'> Click here for full github repo for all projects</a>
            <div className='flex gap-x-6'>
                <ProjectCard url="/redblack">Red Black Tree</ProjectCard>
                <ProjectCard url="/palette">Palette</ProjectCard>
            </div>
            <div className='flex gap-x-6'>
                <ProjectCard >Some stock thing</ProjectCard>
                <ProjectCard >Ai stuff</ProjectCard>
            </div>
            <div className='flex gap-x-6'>
                <ProjectCard ></ProjectCard>
                <ProjectCard ></ProjectCard>
            </div>
          </div>
        </>
      )
}