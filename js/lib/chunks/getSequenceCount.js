function getSequenceCount () {

  const display = Y.one('#display');

  const displayData = display.getData();

  return parseInt(displayData['sequence-count'], 10);

}
