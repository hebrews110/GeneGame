export function getRandomArbitrary(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}
export function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

export function getRandomArrayMember<T>(arr: Array<T>, startIdx = 0): T {
    if(startIdx >= arr.length)
        throw new Error("Start index must be less than array length.");
    return arr[getRandomInt(startIdx, arr.length)];
}
export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function lowercaseFirstLetter(string: string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

export function titleize(string: string) {
    if(string == undefined || string == null)
        return null;
    string = string.charAt(0).toLowerCase() + string.slice(1);
    return string
    // insert a space before all caps
    .replace(/([A-Z])/g, ' $1')
    // uppercase the first character
    .replace(/^./, function(str){ return str.toUpperCase(); });
}