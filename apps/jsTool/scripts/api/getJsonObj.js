const jsonData = {
    test:"test",
    
};
const funId = "";


const keys = Object.keys(jsonData);
var str = `function ${funId}(${keys.toString()}){`;
keys.map(i => {
    str += `\nthis.${i}=${i};`;
});
str += "};"
console.info(str);