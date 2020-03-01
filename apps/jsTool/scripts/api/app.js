let getListFromL10n = sourceList => {
  return sourceList.map(x => $l10n(x));
};
let checkIfUrl = str => {
  const linkList = $detector.link(str);
  return linkList.length == 1 && linkList[0] == str;
}
module.exports = {
  getListFromL10n,
  checkIfUrl
};