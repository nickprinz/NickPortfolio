
export default function HistoryRecord({historyRecord}){
    // {
    //     type:"change",
    //     index:nodeIndex,
    //     attribute:attributeName,
    //     value:attributeValue,
    // }
    // {
    //     type:"compare",
    //     primaryIndex:primaryNodeIndex,
    //     secondaryIndex:SecondaryNodeIndex,
    // }
    // {
    //     type:"note",
    //     index:nodeIndex,
    //     note:note,
    // }
    
    return <>
        {historyRecord.type === "change" && <div>change</div>}
        {historyRecord.type === "compare" && <div>compare</div>}
        {historyRecord.type === "note" && <div>note</div>}
    </>
}