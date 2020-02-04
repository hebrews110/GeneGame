import React from "react";
import SVGFillPatterns from './SVGFillPatterns';
import GeneType, { availableGeneValues, Gene } from './GeneType';
import { lowercaseFirstLetter, getRandomArrayMember, getRandomInt } from './utils';
import shortid from 'shortid';

export interface FuzzyProps {
    bodyColor: string; bodyPattern: string; roundedness?: string; dimpleColor: string; solidEyes?: boolean; animated?: boolean; id?: string; onClick?: () => void;
}
export function getRandomFuzzy(p?: Partial<FuzzyProps>): FuzzyProps {
    let fuzzy: Partial<FuzzyProps> = Object.assign({}, p);
    fuzzy.id = shortid.generate();
    Object.keys(GeneType).filter(key => isNaN(key as any)).forEach(geneType => {
        fuzzy[lowercaseFirstLetter(geneType)] = getRandomArrayMember(availableGeneValues[GeneType[geneType]] as Gene[]).name;
    });
    return fuzzy as FuzzyProps; 
}
export function fuzzyToString(p: FuzzyProps): string {
    if(typeof p != 'object')
        return "";
    let ret = "";
    Object.keys(GeneType).filter(key => isNaN(key as any)).forEach(geneType => {
        ret += `${p[lowercaseFirstLetter(geneType)]}, `;
    });
    return ret.substr(0, ret.length-2);
}
export function breedChild(parents: FuzzyProps[]): FuzzyProps {
    let fuzzy: Partial<FuzzyProps> = {};
    Object.keys(GeneType).filter(key => isNaN(key as any)).forEach(geneType => {
        const genes: Gene[] = [];
        genes.push((availableGeneValues[GeneType[geneType]] as Gene[]).find(val => parents[0][lowercaseFirstLetter(geneType)] == val.name));
        genes.push((availableGeneValues[GeneType[geneType]] as Gene[]).find(val => parents[1][lowercaseFirstLetter(geneType)] == val.name));
        if(genes[0].name == genes[1].name) {
            fuzzy[lowercaseFirstLetter(geneType)] = genes[0].name;
        } else {
            if(genes[0].dominant && !genes[1].dominant) {
                fuzzy[lowercaseFirstLetter(geneType)] = genes[0].name;
            } else if(genes[1].dominant && !genes[0].dominant) {
                fuzzy[lowercaseFirstLetter(geneType)] = genes[1].name;
            } else {
                /* Two different recessive gnenes */
                /* Identical recessive/dominant genes are already handled above */
                /* Make the first one dominant always */
                fuzzy[lowercaseFirstLetter(geneType)] = genes[getRandomInt(0, 2)].name;
            }
        }
    });
    return fuzzy as FuzzyProps;
}
const Fuzzy: React.FC<FuzzyProps> = (props) => {
  const [ clickFired, setClickFired ] = React.useState(false);
  const onClick = () => {
    try {
      var audio = new Audio('snd/pop.mp3');
      audio.play();
    } catch(e) {
      console.error("Audio playback failed", e);
    }
    setClickFired(true);
    
  };
  const onTransitionEnd = () => {
    if(clickFired) {
        setClickFired(false);
        if(typeof props.onClick == 'function')
            props.onClick();
    }
  };
  React.useEffect(() => {
    new Audio('snd/pop.mp3');
  }, []);
  const ellipseRx = 210;
  const ellipseRy = 199;
  const rounded = typeof props.roundedness != 'undefined' ? (props.roundedness == "round") : false;
  return (
    <div className={`fuzzy-container ${props.animated ? "fuzzy-interactive" : ""}`}>
        <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        className="fuzzy"
        onTransitionEnd={onTransitionEnd}
        viewBox="0 0 424.951 403.18"
        >
            <SVGFillPatterns backgroundColor={props.bodyColor}>
                {prefix => (!rounded ? <path
                fill={`url(#${prefix}${props.bodyPattern})`}
                fillRule="evenodd"
                stroke="#000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4.099"
                d="M-68.996 385.37c-.197.01-.4.004-.597.035-7.171 1.078-8.257 13.107-10.085 23.97-7.447-9.23-14.85-18.555-21.188-16.546-6.653 2.108-6.113 13.339-6.114 24.005-7.305-6.76-14.561-13.854-20.626-10.962-5.42 2.583-6.093 12.49-6.43 22.93-7.857-5.244-15.57-10.302-20.803-6.696-6.444 4.442-2.923 19.945-1.475 33.13-10.99-3.903-23.315-10.43-28.743-4.961-5.003 5.04 2.585 15.195 8.468 24.803-11.157-2.204-23.52-6.155-27.83-.14-4.017 5.608 4.497 14.133 11.737 22.48-14.247-.137-30.735-1.72-33.697 4.96-2.884 6.505 9.888 13.51 20.345 20.572-13.695 1.945-29.04 3.137-30.816 9.92-1.673 6.387 10.076 11.084 20.942 15.993-11.703 3.02-23.73 5.943-24.28 12.35-.54 6.266 8.058 12.075 16.62 17.9-9.434 4.17-17.883 8.482-17.464 14.015.546 7.197 12.859 11.925 23.402 17.033-7.113 5.484-14.941 10.759-13.458 17.31 1.435 6.338 11.082 8.13 20.52 10.164-6.209 6.635-13.38 13.163-10.821 19.496 2.753 6.815 14.914 6.243 25.616 7.042-5.004 10.34-11.955 21.524-7.906 27.717 3.1 4.744 11.826 3.714 21.153 2.15-2.872 9.068-5.47 17.917-1.406 22.376 4.443 4.875 15.107.919 25.58-2.637-3.927 7.906-8.003 15.736-2.846 19.773 5.08 3.977 15.54-.07 26.002-4.162-2.71 8.919-6.197 18.137-.105 21.508 6.474 3.582 18.18-4.308 29.164-10.615-1.176 12.303-5.12 27.308 2.565 29.695 7.321 2.273 15.648-9.424 23.859-18.628.533 11.843-.289 25.392 7.168 26.468 7.752 1.118 14.201-12.314 20.977-22.791 6.746 12.636 12.998 29.299 21.083 29.417 7.139.104 9.55-11.446 12.509-21.82 6.845 9.576 13.645 18.907 19.923 18.004 7.172-1.032 7.595-13.137 8.89-23.971 7.382 6.419 14.778 13.175 21.258 11.17 5.719-1.77 7.424-10.352 8.855-19.461 7.413 4.594 14.676 8.71 20.099 6.036 5.995-2.957 5.669-13.516 5.587-23.867 11.788 8.242 25.188 20.823 31.624 16.2 6.716-4.824-2.454-20.668-6.817-33.406 12.418 6.3 26.237 15.133 31.519 9.886 5.205-5.17-3.364-16.977-9.804-27.89 11.355.91 23.277 2.37 27.197-3.123 4.117-5.77-2.883-14.11-8.609-22.236 10.63-.792 21.25-1.585 24.034-7.215 2.522-5.1-2.328-10.703-7.94-16.408 10.344-.962 20.714-1.87 22.382-7.944 1.866-6.794-9.273-13.846-18.869-20.918 11.287-3.065 24.496-5.34 25.264-12.523.715-6.68-10.324-11.721-20.556-16.93 11.54-5.488 24.403-10.737 23.718-17.448-.672-6.592-12.93-10.021-24.315-13.737 10.263-7.016 21.346-14.037 19.642-20.363-1.662-6.17-13.462-7.714-24.913-9.505 7.868-6.367 15.551-12.672 12.825-18.212-2.926-5.948-15.663-6.042-27.759-6.557 7.65-8.857 17.59-18.112 13.352-24.075-4.094-5.763-18.098-3.247-30.78-1.873 5.54-9.478 11.888-19.215 7.308-24.283-4.029-4.457-14.729-2.56-25.826-.243 3.813-9.793 7.877-19.668 2.776-23.763-6.095-4.893-21.525 2.616-34.927 7.39 1.38-10.7 4.096-22.497-2.32-26.088-6.035-3.379-14.35 5.11-22.628 12.731-.492-11.099.664-24.066-6.536-26.71-6.54-2.404-13.428 7.405-20.415 16.27-1.001-8.957-2.073-17.632-8.328-18.63-5.981-.954-12.682 6.132-19.43 13.807-2.573-9.178-4.944-18.485-11.632-18.49-8.044-.006-15.049 14.181-22.313 25.081-7.43-11.63-14.414-28.352-22.559-27.96z"
                transform="translate(243.097 -383.314)"
                ></path> :
                <ellipse cx={ellipseRx+1} cy={ellipseRy+1} rx={ellipseRx} ry={ellipseRy}  fill={`url(#${prefix}${props.bodyPattern})`} stroke="#000" strokeWidth="4.099"></ellipse>
                )}
            </SVGFillPatterns>
            
            {(rounded && props.animated) && <ellipse fill="white" onClick={onClick} className="fuzzy-hover" cx={ellipseRx+1} cy={ellipseRy+1} rx={ellipseRx} ry={ellipseRy} stroke="black" strokeWidth="4.099"></ellipse>}
            {(!rounded && props.animated) && <path
            fill="white"
            fillRule="evenodd"
            d="M-68.996 385.37c-.197.01-.4.004-.597.035-7.171 1.078-8.257 13.107-10.085 23.97-7.447-9.23-14.85-18.555-21.188-16.546-6.653 2.108-6.113 13.339-6.114 24.005-7.305-6.76-14.561-13.854-20.626-10.962-5.42 2.583-6.093 12.49-6.43 22.93-7.857-5.244-15.57-10.302-20.803-6.696-6.444 4.442-2.923 19.945-1.475 33.13-10.99-3.903-23.315-10.43-28.743-4.961-5.003 5.04 2.585 15.195 8.468 24.803-11.157-2.204-23.52-6.155-27.83-.14-4.017 5.608 4.497 14.133 11.737 22.48-14.247-.137-30.735-1.72-33.697 4.96-2.884 6.505 9.888 13.51 20.345 20.572-13.695 1.945-29.04 3.137-30.816 9.92-1.673 6.387 10.076 11.084 20.942 15.993-11.703 3.02-23.73 5.943-24.28 12.35-.54 6.266 8.058 12.075 16.62 17.9-9.434 4.17-17.883 8.482-17.464 14.015.546 7.197 12.859 11.925 23.402 17.033-7.113 5.484-14.941 10.759-13.458 17.31 1.435 6.338 11.082 8.13 20.52 10.164-6.209 6.635-13.38 13.163-10.821 19.496 2.753 6.815 14.914 6.243 25.616 7.042-5.004 10.34-11.955 21.524-7.906 27.717 3.1 4.744 11.826 3.714 21.153 2.15-2.872 9.068-5.47 17.917-1.406 22.376 4.443 4.875 15.107.919 25.58-2.637-3.927 7.906-8.003 15.736-2.846 19.773 5.08 3.977 15.54-.07 26.002-4.162-2.71 8.919-6.197 18.137-.105 21.508 6.474 3.582 18.18-4.308 29.164-10.615-1.176 12.303-5.12 27.308 2.565 29.695 7.321 2.273 15.648-9.424 23.859-18.628.533 11.843-.289 25.392 7.168 26.468 7.752 1.118 14.201-12.314 20.977-22.791 6.746 12.636 12.998 29.299 21.083 29.417 7.139.104 9.55-11.446 12.509-21.82 6.845 9.576 13.645 18.907 19.923 18.004 7.172-1.032 7.595-13.137 8.89-23.971 7.382 6.419 14.778 13.175 21.258 11.17 5.719-1.77 7.424-10.352 8.855-19.461 7.413 4.594 14.676 8.71 20.099 6.036 5.995-2.957 5.669-13.516 5.587-23.867 11.788 8.242 25.188 20.823 31.624 16.2 6.716-4.824-2.454-20.668-6.817-33.406 12.418 6.3 26.237 15.133 31.519 9.886 5.205-5.17-3.364-16.977-9.804-27.89 11.355.91 23.277 2.37 27.197-3.123 4.117-5.77-2.883-14.11-8.609-22.236 10.63-.792 21.25-1.585 24.034-7.215 2.522-5.1-2.328-10.703-7.94-16.408 10.344-.962 20.714-1.87 22.382-7.944 1.866-6.794-9.273-13.846-18.869-20.918 11.287-3.065 24.496-5.34 25.264-12.523.715-6.68-10.324-11.721-20.556-16.93 11.54-5.488 24.403-10.737 23.718-17.448-.672-6.592-12.93-10.021-24.315-13.737 10.263-7.016 21.346-14.037 19.642-20.363-1.662-6.17-13.462-7.714-24.913-9.505 7.868-6.367 15.551-12.672 12.825-18.212-2.926-5.948-15.663-6.042-27.759-6.557 7.65-8.857 17.59-18.112 13.352-24.075-4.094-5.763-18.098-3.247-30.78-1.873 5.54-9.478 11.888-19.215 7.308-24.283-4.029-4.457-14.729-2.56-25.826-.243 3.813-9.793 7.877-19.668 2.776-23.763-6.095-4.893-21.525 2.616-34.927 7.39 1.38-10.7 4.096-22.497-2.32-26.088-6.035-3.379-14.35 5.11-22.628 12.731-.492-11.099.664-24.066-6.536-26.71-6.54-2.404-13.428 7.405-20.415 16.27-1.001-8.957-2.073-17.632-8.328-18.63-5.981-.954-12.682 6.132-19.43 13.807-2.573-9.178-4.944-18.485-11.632-18.49-8.044-.006-15.049 14.181-22.313 25.081-7.43-11.63-14.414-28.352-22.559-27.96z"
            transform="translate(243.097 -383.314)"
            className="fuzzy-hover"
            onClick={onClick}
            stroke="black"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4.099"
            ></path>}
            {/*
            <path
            fill={props.dimpleColor}
            fillRule="evenodd"
            d="M-510.09 61.447c7.793-21.827 36.982-34.634 65.197-28.605 28.215 6.028 44.77 28.609 36.978 50.435-7.792 21.827-36.982 34.634-65.197 28.605-23.175-4.952-39.139-21.35-38.887-39.949"
            opacity="0.77"
            transform="translate(243.097 -383.314) matrix(.44877 0 0 .49531 89.411 529.01)"
            ></path>
            <path
            fill={props.dimpleColor}
            fillRule="evenodd"
            d="M-510.09 61.447c7.793-21.827 36.982-34.634 65.197-28.605 28.215 6.028 44.77 28.609 36.978 50.435-7.792 21.827-36.982 34.634-65.197 28.605-23.175-4.952-39.139-21.35-38.887-39.949"
            opacity="0.77"
            transform="translate(243.097 -383.314) matrix(.44877 0 0 .49531 266.22 526.04)"
            ></path>*/}
            <path
            fill="#ff0000"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="5.658"
            d="M-55.541 583.67c1.222 58.467 52.724 67.49 53.852 0"
            transform="translate(243.097 -383.314)"
            ></path>
            {!props.solidEyes && 
            <g transform="translate(243.097 -383.314)">
                <path
                fill="none"
                stroke="#000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="7"
                d="M-99.159 542.24c.824-21.956 35.557-25.344 36.318 0M1.84 541.24c.825-21.956 35.558-25.344 36.319 0"
                ></path>
            </g>}
            {props.solidEyes && <>
                <ellipse cx="264" cy="150" rx="20" ry="15" fill="black"></ellipse>
                <ellipse cx="161" cy="150" rx="20" ry="15" fill="black"></ellipse>
            </>}
        </svg>
    </div>
  );
}

export default Fuzzy;