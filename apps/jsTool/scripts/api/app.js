let getListFromL10n = sourceList => {
  var l10nList = [];
  for (i in sourceList) {
    l10nList.push($l10n(sourceList[i]));
  }
  return l10nList;
};

module.exports = {
  getListFromL10n,
};