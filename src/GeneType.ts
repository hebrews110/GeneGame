enum GeneType {
    BodyPattern,
    BodyColor,
    Roundedness
};

export class Gene {
    constructor(public name: string, public dominant = true) {

    }
}
const availableGeneValues: { [P in GeneType]: Gene[]; } = {
    [GeneType.BodyPattern]: [ new Gene("solid", true), new Gene("striped", false), new Gene("dotted", false) ],
    [GeneType.BodyColor]: [ new Gene("green", false), new Gene("red", false), new Gene("yellow", false), new Gene("blue", true) ],
    [GeneType.Roundedness]: [ new Gene("round", false), new Gene("fuzzy", true) ],
};
const hideVisualForGeneType: { [P in GeneType]?: boolean; } = {
    [GeneType.Roundedness]: true
};
export { availableGeneValues, hideVisualForGeneType };
export default GeneType;