async function increase(props) {
  const sequence_current = Number(props.dataset.sequence)
  const sequence_count = Number(props.dataset.sequenceCount)
  const sequence = sequence_current + 1  
  if (sequence > sequence_count) {
    return sequence_count
  } else {
    props.dataset.sequence = sequence.toString()
    document.querySelector('#range_weight').value = sequence  
    document.querySelector('#slider_value').value = sequence
  }
}

export { increase }
