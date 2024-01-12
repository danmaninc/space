import {useState} from "react";

export interface Fragment {
    x: number,
    y: number
}

export const useStack = () => {
    const [action, setAction] = useState<Fragment[]>([]);
    const [stack, setStack] = useState<Fragment[][]>([]);

    function addStep(step: Fragment) {
        action.push(step);
        setAction(action);
    }

    function endAction() {
        stack.push(action);
        setAction([]);
        setStack(stack);
    }

    return {
        stack, addStep, endAction
    }

}