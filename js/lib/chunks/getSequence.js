function getSequence () {

  const display = Y.one('#display');

  const displayData = display.getData();

  return parseInt(displayData.sequence, 10);

}
