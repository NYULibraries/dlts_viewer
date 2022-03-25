async function change(to, props) {
  const sequence = Number(to)
  const sequence_count = Number(props.dataset.sequenceCount)
  if (sequence < 1) {
    return 1
  } else if (sequence > sequence_count) {
    return sequence_count
  } else {
    props.dataset.sequence = sequence.toString()
    document.querySelector('#range_weight').value = sequence  
    document.querySelector('#slider_value').value = sequence
  }
}

export { change }
