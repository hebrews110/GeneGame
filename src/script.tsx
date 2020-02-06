import React from 'react';
import ReactDOM from 'react-dom';
import Fuzzy, { FuzzyProps, getRandomFuzzy, breedChild, fuzzyToString } from './Fuzzy';
import GeneChart from './GeneChart';
import GeneType, { availableGeneValues, Gene } from './GeneType';
import { titleize, getRandomArrayMember, lowercaseFirstLetter } from './utils';
import isEqual from 'lodash-es/isEqual';
import FlippableGeneChart from './FlippableGeneChart';
function genAvailableParents(): FuzzyProps[] {
    var arr = [];
    for(var i = 0; i < 4; i++) {
        arr.push(getRandomFuzzy());
    }
    return arr;
}
function App() {
    const [ currentType, setCurrentType ] = React.useState<GeneType>(0);
    const initialFuzzy = React.useMemo(getRandomFuzzy, [ getRandomFuzzy ]);
    const [ targetFuzzy, setTargetFuzzy ] = React.useState(initialFuzzy);
    const [ parents, setParents ] = React.useState<FuzzyProps[]>([]);
    const initialAvailableParents = React.useMemo(genAvailableParents, [ genAvailableParents ]);
    const [ availableParents, setAvailableParents ] = React.useState<FuzzyProps[]>(initialAvailableParents);
    const [ childFuzzy, setChildFuzzy ] = React.useState<FuzzyProps>(null);
    const resetSystem = (resetGeneType?: boolean) => {
        if(resetGeneType) {
            setTargetFuzzy(getRandomFuzzy());
        }
        setParents([]);
        setAvailableParents(genAvailableParents());
        setChildFuzzy(null);
    };
    const chooseParent = (parent) => {
        const newParents = parents.slice();
        newParents.push(parent);
        const new_A_Parents = availableParents.slice();
        new_A_Parents.splice(availableParents.indexOf(parent), 1);
        setAvailableParents(new_A_Parents);
        if(newParents.length >= 2) {
            setChildFuzzy(breedChild(newParents));
        }
        setParents(newParents);
    };
    const regenParents = () => {
        setAvailableParents(genAvailableParents());
    };
    const correctValue = childFuzzy != null ? fuzzyToString(childFuzzy) == fuzzyToString(targetFuzzy) : false;
    React.useEffect(() => {
        if(childFuzzy != null && !correctValue) {
            window.alert(`Hmm. That doesn't seem like a ${fuzzyToString(targetFuzzy)} child. Click on the child to try two different parents.`);
        }
    }, [ correctValue, childFuzzy ]);
    if(parents.length >= 2)
        return <>
            <FlippableGeneChart currentType={currentType} setCurrentType={setCurrentType} targetFuzzy={targetFuzzy}/>
            <h2>Parents:</h2>
            <div className="fuzzy-list">
                {parents.map(parent => <Fuzzy key={parent.id} {...parent}/>)}
            </div>
            <h2>Child ({fuzzyToString(childFuzzy)}):</h2>
            <div className="fuzzy-list">
                <Fuzzy {...childFuzzy} animated onClick={resetSystem.bind(this, correctValue)}/>
            </div>
            {correctValue && <h2>Good work!</h2>}
            {correctValue && <button className="hoverable-button" onClick={resetSystem.bind(this, correctValue)}>Play again</button>}
        </>;
    else
        return <>
            <FlippableGeneChart currentType={currentType} setCurrentType={setCurrentType} targetFuzzy={targetFuzzy}/>
            <h3>Target: {fuzzyToString(targetFuzzy)} child.</h3>
            <p>Choose two appropriate parents:</p>
            {parents.length == 0 && <button className="hoverable-button" onClick={regenParents}>New set of parents</button>}
            <div className="fuzzy-list">
                {parents.map(parent => <Fuzzy key={parent.id} {...parent}/>)}
            </div>
            <div className="fuzzy-list fuzzy-list-bottom">
                {availableParents.map(parent => <Fuzzy key={parent.id} {...parent} onClick={chooseParent.bind(this, parent)} animated/>)}
            </div>
        </>;
}
window.onload = function() {
    ReactDOM.render(<App/>, document.getElementById("game-container"));
};