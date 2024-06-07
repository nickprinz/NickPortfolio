

export function setBodyColor(extraClasses){
    document.body.setAttribute("class", `w-full h-full overflow-y-scroll ${extraClasses}`);
}

export function setPageTitle(title){
    document.title = title;
}