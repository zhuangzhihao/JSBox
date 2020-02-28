let getListFromL10n = sourceList => {
  return sourceList.map(x => $l10n(x));
};
let checkIfUrl = str => {

}
module.exports = {
  getListFromL10n,
};