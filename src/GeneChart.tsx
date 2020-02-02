import React from 'react';
import GeneType, { availableGeneValues, hideVisualForGeneType } from './GeneType';
import SVGFillPatterns from './SVGFillPatterns';
import { capitalizeFirstLetter, titleize } from './utils';

const GeneChart: React.FC<{ type: GeneType; targetValue?: string; }> = (props) => {
    console.log(props.targetValue);
    return <table className="gene-chart">
        <thead>
            <tr>
                <th colSpan={availableGeneValues[props.type].length}>{titleize(GeneType[props.type])}</th>
            </tr>
            <tr>
                {availableGeneValues[props.type].map(gene => {
                    const isTarget = typeof props.targetValue == 'string' && gene.name == props.targetValue;
                    return <th key={gene.name} className={isTarget ? "gene-chart-target" : null}>
                        {capitalizeFirstLetter(gene.name) + `${isTarget ? "*" : ""} (${gene.dominant ? "D" : "R"})`}
                    </th>;
                })}
            </tr>
        </thead>
        <tbody>
            {!hideVisualForGeneType[props.type] && 
            <tr>
                {availableGeneValues[props.type].map(gene => (
                    <td key={gene.name} className="gene-chart-display">
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100">
                            <SVGFillPatterns backgroundColor={props.type == GeneType.BodyColor ? gene.name : "#4080ff"}>
                                {prefix => <rect fill={`url(#${prefix}${props.type == GeneType.BodyPattern ? gene.name : "solid"})`} width="100" height="100"></rect>}
                            </SVGFillPatterns>
                        </svg>
                    </td>
                ))}
            </tr>}
        </tbody>
    </table>;
};
export default GeneChart;