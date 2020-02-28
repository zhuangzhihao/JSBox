let getListFromL10n = sourceList => {
  return sourceList.map(x => $l10n(x));
};
module.exports = {
  getListFromL10n,
};