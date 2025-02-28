(async () => {
  try {
    document.addEventListener('DOMContentLoaded', function() {

      document.querySelectorAll('a.opt-delete').forEach(element => {
        element.onclick = async (event) => {
          try {
            event.preventDefault()
            const href = event.target.href
            // Get the parent element of the clicked element
            const parentElement = event.target.parentElement.parentElement
            const response = await fetch(href, { method: 'DELETE' })
            let message = 'Item deleted successfully'
            if (response.ok) {
              if (response.headers.get("Content-Type")?.includes('application/json')) {
                const data = await response.json()
                message = data.message.toString()
              }
              if (parentElement.tagName === 'TR') {
                parentElement.remove()
                swal(message, { timer: 3000, icon: 'success' })
              }
            }
          } catch (error) {
              console.error('Network error:', error)
          }
        }
      })

      document.querySelectorAll('a.opt-index').forEach(async (element) => {

        element.onclick = async (event) => {
          try {
            event.preventDefault()
            const href = event.target.href
            const response = await fetch(href)
            if (response.ok) {
              if (response.headers.get("Content-Type")?.includes('application/json')) {
                const data = await response.json()
                swal(`Epbu ${data.message.docs.title} (${data.message.docs.identifier}) - ${data.status_message}`, { timer: 3000, icon: 'success' })
              }
            }
          } catch (error) {
              console.error('Network error:', error)
          }
        }
      })

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
        .then(response => {
          if (response.error) throw new Error(response.message)
          const { data, message } = response
          swal.stopLoading()
          swal.close()
          const table = document.querySelector('table.epubs-table')
          const temp = document.querySelector('template.new-item')
          const clon = temp.content.cloneNode(true)
          const today = new Date(Date.now())
          clon.querySelector('.title').innerHTML = data.title.toString()
          clon.querySelector('.identifier').innerText = data.isbnLibrary.toString()
          clon.querySelector('.last-modified').innerText = `${today.getFullYear()}-${today.getMonth() + 1 }-${today.getDate()}`
          table.appendChild(clon)
          swal(message.toString(), {
            timer: 3000,
            icon: 'success',
          })
        })
        .catch(error => {
          if (error) {
            swal(error.toString(), { timer: 3000, icon: 'error', })   
          } else {
            swal.stopLoading()
            swal.close()
          }
        })
      }
    })
  }
  catch (error) {
    console.error('Network error:', error)
  }
})()
