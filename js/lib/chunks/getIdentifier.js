function getIdentifier () {

  const display = Y.one('#display');

  const displayData = display.getData();

  return displayData.identifier;

}
