import { seqmap } from './seqmap.mjs'

async function toggleview(props, _seqmap) {

  if (props.dataset.view == 'single') {
    props.dataset.view = 'doublepage'
  } else {
    props.dataset.view = 'single'
  }

  const sequence_current = _seqmap.sequences[Number(props.dataset.sequence) - 1].find(e => true)

  console.log('toggleview', sequence_current)

  const count = props.dataset.sequenceCount

  const view = props.dataset.view

  const _ = await seqmap({ count, view })

  props.dataset.sequence = sequence_current

  // props.dataset.sequenceCount = _.count

  document.querySelector('#range_weight').max = _.count
  
  document.querySelector('.sequence_count').textContent = _.count

  document.querySelector('.current_page').textContent = sequence_current

  document.querySelector('#slider_value').value = sequence_current

  document.querySelector('#range_weight').value = sequence_current

  return _

}

export { toggleview }
