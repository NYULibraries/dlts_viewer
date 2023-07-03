(() => {

  document.querySelector('html').setAttribute('data-theme', 'light')

  document.querySelector('#add-epub').onclick = event => {
    event.preventDefault()
    
    const data = document.querySelector('#add-epub-container').dataset
    
    const { api, partner }  = data 

    swal({
      text: 'Search using book ISBN13. e.g. "9780814705384".',
      content: "input",
      button: {
        text: "Search!",
        closeModal: false,
      },
    })
    .then(id => {
      if (!id) throw null
      return fetch(`${api}/${partner}/${id}`, { method: 'POST', cache: 'no-cache' })
    })
    .then((response) => response.json())
    .then(data => {
      if (data.error) throw new Error(data.message)
      swal.stopLoading()
      swal.close()
      const table = document.querySelector('table.epubs-table')
      const temp = document.querySelector('template.new-item')
      const clon = temp.content.cloneNode(true)
      const today = new Date(Date.now())
      clon.querySelector('.title').innerHTML = data.title.toString()
      clon.querySelector('.identifier').innerText = data.isbn.toString()
      clon.querySelector('.last-modified').innerText = `${today.getFullYear()}-${today.getMonth() + 1 }-${today.getDate()}`
      table.appendChild(clon)
      swal(data.title.toString(), {
        timer: 3000,
        icon: 'success',
      })
    })
    .catch(error => {
      if (error) {
        swal(error.toString(), {
          timer: 3000,
          icon: 'error',
        });        
      } else {
        swal.stopLoading()
        swal.close()
      }
    })
  }
})()
