

export default function TailwindColorFixer({}){
    //this is a hack around tailwind not picking up dynamically generated classes in code
    //this forces the classes to exist statically somewhere so RedBlackNodeElement can pick them up
    const classes = ` from-gray-100 from-gray-200 from-gray-300 from-gray-400 from-gray-500 from-gray-600 from-gray-700 
                            to-gray-100 to-gray-200 to-gray-300 to-gray-400 to-gray-500 to-gray-600 to-gray-700 
                            hover:from-gray-100 hover:from-gray-200 hover:from-gray-300 hover:from-gray-400 hover:from-gray-500 hover:from-gray-600 hover:from-gray-700 
                            hover:to-gray-100 hover:to-gray-200 hover:to-gray-300 hover:to-gray-400 hover:to-gray-500 hover:to-gray-600 hover:to-gray-700 
                            from-red-100 from-red-200 from-red-300 from-red-400 from-red-500 from-red-600 from-red-700 
                            to-red-100 to-red-200 to-red-300 to-red-400 to-red-500 to-red-600 to-red-700 
                            hover:from-red-100 hover:from-red-200 hover:from-red-300 hover:from-red-400 hover:from-red-500 hover:from-red-600 hover:from-red-700 
                            hover:to-red-100 hover:to-red-200 hover:to-red-300 hover:to-red-400 hover:to-red-500 hover:to-red-600 hover:to-red-700
                            `
    return <div className={classes}> 
    </div>;
}