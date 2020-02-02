import React from 'react';
import ReactDOM from 'react-dom';
import Fuzzy, { FuzzyProps, getRandomFuzzy, breedChild } from './Fuzzy';
import GeneChart from './GeneChart';
import GeneType, { availableGeneValues, Gene } from './GeneType';
import { titleize, getRandomArrayMember, lowercaseFirstLetter } from './utils';
function genAvailableParents(): FuzzyProps[] {
    var arr = [];
    for(var i = 0; i < 4; i++) {
        arr.push(getRandomFuzzy());
    }
    return arr;
}
function App() {
    const [ geneType, setGeneType ] = React.useState(null);
    const [ targetValue, setTargetValue ] = React.useState(null);
    const [ parents, setParents ] = React.useState<FuzzyProps[]>([]);
    const initialAvailableParents = React.useMemo(genAvailableParents, [ genAvailableParents ]);
    const [ availableParents, setAvailableParents ] = React.useState<FuzzyProps[]>(initialAvailableParents);
    const [ childFuzzy, setChildFuzzy ] = React.useState<FuzzyProps>(null);
    const resetSystem = (resetGeneType?: boolean) => {
        if(resetGeneType) {
            setGeneType(null);
            setTargetValue(null);
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
    React.useEffect(() => {
        if(geneType != null) {
            setTargetValue(getRandomArrayMember(availableGeneValues[geneType] as Gene[]).name);
        }
    }, [ geneType ]);
    const correctValue = childFuzzy != null ? childFuzzy[lowercaseFirstLetter(GeneType[geneType])] == targetValue : false;
    if(geneType != null && parents.length >= 2)
        return <>
            <GeneChart type={geneType} targetValue={targetValue}/>
            <h2>Parents ({titleize(parents[0][lowercaseFirstLetter(GeneType[geneType])])}, {titleize(parents[1][lowercaseFirstLetter(GeneType[geneType])])}):</h2>
            <div className="fuzzy-list">
                {parents.map(parent => <Fuzzy key={parent.id} {...parent}/>)}
            </div>
            <h2>Child ({titleize(childFuzzy[lowercaseFirstLetter(GeneType[geneType])])}):</h2>
            <div className="fuzzy-list">
                <Fuzzy {...childFuzzy} animated onClick={resetSystem.bind(this, correctValue)}/>
            </div>
            <h2>{correctValue ? "Good work! You can click on the child to try a different gene type." : `Hmm. That doesn't seem like a ${targetValue} child. Click on the child to try two different parents.`}</h2>
        </>;
    else if(geneType != null)
        return <>
            <GeneChart type={geneType} targetValue={targetValue}/>
            <h2>We need a {targetValue} child. Choose two appropriate parents:</h2>
            <button className="hoverable-button" onClick={regenParents}>New set of parents</button>
            <div className="fuzzy-list">
                {parents.map(parent => <Fuzzy key={parent.id} {...parent}/>)}
            </div>
            <div className="fuzzy-list fuzzy-list-bottom">
                {availableParents.map(parent => <Fuzzy key={parent.id} {...parent} onClick={chooseParent.bind(this, parent)} animated/>)}
            </div>
        </>;
    else 
        return <>
            <h2>Choose a category:</h2> 
            <div className="gene-type-list">
                {Object.keys(GeneType).filter(key => isNaN(key as any)).map(type => <button onClick={setGeneType.bind(void 0, GeneType[type])} className="hoverable-button" key={type}>{titleize(type)}</button>)}
            </div>
        </>;
}
window.onload = function() {
    ReactDOM.render(<App/>, document.getElementById("game-container"));
};