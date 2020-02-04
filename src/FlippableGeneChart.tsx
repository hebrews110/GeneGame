import React from 'react';
import { FuzzyProps } from './Fuzzy';
import GeneType from './GeneType';
import GeneChart from './GeneChart';
import { lowercaseFirstLetter } from './utils';

const typesLength = Object.keys(GeneType).filter(val => isNaN(val as any)).length;

const FlippableGeneChart: React.FC<{ currentType: GeneType; setCurrentType: (v: GeneType) => void; targetFuzzy: FuzzyProps; }> = (props) => {
    const targetValue = typeof props.targetFuzzy != 'undefined' && props.targetFuzzy[lowercaseFirstLetter(GeneType[props.currentType])];
    const onIncrement = (delta: number) => {
        const n = props.currentType + delta;
        if(n >= 0 && n <= (typesLength - 1)) {
            props.setCurrentType(n);
        }
    };
    return <div className="gene-chart-flippable">
        <button className="hoverable-button gene-chart-flippable-left" onClick={onIncrement.bind(this, -1)}>&lt;</button>
        <GeneChart targetValue={targetValue} type={props.currentType}/>
        <button className="hoverable-button gene-chart-flippable-right" onClick={onIncrement.bind(this, 1)}>&gt;</button>
    </div>;
}
export default FlippableGeneChart;