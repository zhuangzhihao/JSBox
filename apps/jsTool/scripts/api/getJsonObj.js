// 可以在node.js环境运行
const jsonData = {};

let gen_1 = (funId) => {
    const keys = Object.keys(jsonData);
    var str = `function ${funId}(${keys.toString()}){`;
    keys.map(i => {
        str += `\nthis.${i}=${i};`;
    });
    str += "};"
    console.info(str);
};

let gen_2 = (funId, objId) => {
    const keys = Object.keys(jsonData);
    var str = `function ${funId}(${objId}){`;
    keys.map(i => {
        str += `\nthis.${i} = ${objId}.${i};`;
    });
    str += "};"
    console.info(str);
};
// gen_2("BasicData", "_basicData");