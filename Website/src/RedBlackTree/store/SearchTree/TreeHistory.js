const historyCount = 10;

export default class TreeHistory{
    //changes needed
    //steps need to be able to bundle a few changes
    //such as root change and parent adjustment
    //also multiple color swaps for rebalance
    //need steps to have their own note property to explain a change

    static MakeInitialHistory(){
        return {
            actions: [],
            nextHistoryId: 0,
            currentHistoryAction:-1,
            currentHistoryStep:-1,
        };
    }

    #keepHistory = true;
    history;
    #onUndo;
    #onRedo
    constructor(history, onUndo, onRedo, keepHistory=true){
        this.history = history;
        this.#keepHistory = keepHistory;
        this.#onUndo = onUndo;
        this.#onRedo = onRedo;
        if(!this.#keepHistory){
            this.clearHistory();
        }
    }

    actionCount(){
        return this.history.actions.length;
    }

    currentHistoryAction(){
        return this.history.currentHistoryAction;
    }

    currentHistoryStep(){
        return this.currentHistoryStep;
    }

    clearHistory(){
        Object.assign(this.history, TreeHistory.MakeInitialHistory());
    }

    moveHistory(amount){
        const keepH = this.#keepHistory;
        this.#keepHistory = false;
        
        const moveBack = amount < 0;
        let totalSteps = Math.round(Math.abs(amount));
        for (let index = 0; index < totalSteps; index++) {
            if(moveBack){
                this._moveHistoryBack();
            }else{
                this._moveHistoryForward();
            }
        }
        this.#keepHistory = keepH;
    }

    moveHistoryToCurrent(){
        while(this.history.currentHistoryAction !== -1){
            this.moveHistory(1);
        }
    }

    moveHistoryToLast(){
        if(this.history.actions.length === 0) return;
        while(this.history.currentHistoryAction < this.history.actions.length){
            this.moveHistory(-1);
        }
    }

    setHistoryToPosition(actionIndex, stepIndex){
        if(this.history.actions.length === 0) return;
        if(actionIndex < -1) {
            actionIndex = -1;
            stepIndex = -1;
        }
        if(actionIndex > this.history.actions.length) {
            actionIndex = this.history.actions.length;
            stepIndex = 0;
        }
        stepIndex = Math.max(stepIndex, 0);
        const targetAction = this.history.actions[actionIndex];
        if(!targetAction) {
            stepIndex = 0;
        }
        else{
            stepIndex = Math.min(stepIndex, targetAction.steps.length);
        }
        
        let moveBack = true;
        if(actionIndex === this.history.currentHistoryAction)
        {
            if(stepIndex === this.history.currentHistoryStep) return;//already there
            moveBack = this.history.currentHistoryStep > stepIndex;
        } else{
            moveBack = this.history.currentHistoryAction < actionIndex;
        }
        const moveDir =  moveBack ? -1 : 1;
        while(actionIndex !== this.history.currentHistoryAction || stepIndex !== this.history.currentHistoryStep){
            this.moveHistory(moveDir);
        }
    }

    isKeeping(){
        return this.#keepHistory;
    }

    addAction(treeAction){
        if(!this.isKeeping()) return;
        const newAction = {...treeAction, 
            id: this.history.nextHistoryId,
            steps: [],};
        this.history.nextHistoryId++;
        this.history.actions.splice(0,0,newAction);
        if(this.history.actions.length > historyCount){
            this.history.actions = this.history.actions.slice(0,historyCount);
        }
    }

    addStep(treeStep){
        if(!this.isKeeping()) return;
        const actionHistory = this.#getCurrentAction();
        actionHistory.steps.push(treeStep);
    }

    #getCurrentAction(){
        return this.history.actions[0];
    }


    _moveHistoryBack(){
        if(!this._moveHistoryIndexBack()) return;
        const activeStep = this._getCurrentHistoryStep();
        if(!activeStep) return;
        if(this.#onUndo){
            this.#onUndo(activeStep);
        }
    }

    _moveHistoryForward(){
        const activeStep = this._getCurrentHistoryStep();
        if(activeStep && this.#onRedo){
            this.#onRedo(activeStep);
        }
        if(!this._moveHistoryIndexForward()) return;
    }

    _getCurrentHistoryStep(){
        const activeAction = this.history.actions[this.history.currentHistoryAction];
        if(!activeAction) return null;
        return activeAction.steps[this.history.currentHistoryStep];
    }

    _moveHistoryIndexBack(){
        if(this.history.currentHistoryAction === this.history.actions.length || this.history.actions.length === 0){
            this.history.currentHistoryStep = -1;
            return false;//already at back
        }
        if(this.history.currentHistoryAction === -1 || this.history.currentHistoryStep === 0){
            this.history.currentHistoryAction++;
            if(this.history.currentHistoryAction === this.history.actions.length){
                return true;
            }
            this.history.currentHistoryStep = this.history.actions[this.history.currentHistoryAction].steps.length;
            return true;
        }

        this.history.currentHistoryStep--;
        return true;
    }

    _moveHistoryIndexForward(){
        if(this.history.currentHistoryAction === -1){
            this.history.currentHistoryStep = -1;
            return false;//already at front
        }
        if(this.history.currentHistoryAction === this.history.actions.length){
            this.history.currentHistoryAction--;
            this.history.currentHistoryStep = 0;
            return true;//at back, might display a message later, for now just start the first action

        }
        if(this.history.currentHistoryStep === this.history.actions[this.history.currentHistoryAction].steps.length){
            this.history.currentHistoryAction--;
            this.history.currentHistoryStep = 0;
            return true;
        }
        this.history.currentHistoryStep++;
        return true;
    }

}