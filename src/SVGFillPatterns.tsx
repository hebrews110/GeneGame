import React from 'react';
import shortid from 'shortid';

const SVGFillPatterns: React.FC<{ backgroundColor?: string; children: (idPrefix: string) => React.ReactNode; }> = (props) => {
    const { backgroundColor = "white" } = props;
    const [ idPrefix, setIdPrefix ] = React.useState(shortid.generate());
    return <>
        <defs>
            <pattern id={`${idPrefix}striped`} width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="10" height="10" style={{ fill: backgroundColor }}/>
                <line x1="0" y1="0" x2="0" y2="10" style={{ stroke: "black", strokeWidth: 2 }}/>
            </pattern>
            <pattern id={`${idPrefix}solid`} width="10" height="10" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="10" height="10" style={{ fill: backgroundColor }}/>
            </pattern>
            <pattern id={`${idPrefix}dotted`}
                x="50" y="50" width="100" height="100"
                patternUnits="userSpaceOnUse" >
                <rect x="0" y="0" width="100" height="100" style={{ fill: backgroundColor }}/>
                <circle cx="10" cy="10" r="10" style={{ stroke: "none", fill: "black", opacity: "0.2" }} />
            </pattern>
        </defs>
        {typeof props.children == 'function' && props.children(idPrefix)}
    </>;
}
export default SVGFillPatterns;