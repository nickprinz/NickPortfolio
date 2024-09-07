export default function ColorCell({position, size, color = "#ffffff", id, isSelected, onCellClicked}){

    let w = toRem(size.X);

    return <>
    <div className="absolute" onClick={() => {onCellClicked(id)}} style={ 
    {
        width:toRem(size.X), 
        height:toRem(size.Y),
        left:toRem(position.X), 
        top:toRem(position.Y),
        backgroundColor: isSelected ? "#ffffff" : color,
    }}>
    </div>
    </>
}

let toRem = (num) => {
    return `${num}rem`;
}