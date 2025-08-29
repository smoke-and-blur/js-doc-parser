self.addEventListener('fetch', (event) => {
  console.log(event)
  event.respondWith(
    async function() {
        return fetch(event.request)
    }
  )
});