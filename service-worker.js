self.addEventListener('fetch', (event) => {
  console.log(event)
  if (event.request.url.pathname !== "/") {
    return
  }

  if (event.request.method !== "POST") {
    return
  }
  
  event.respondWith(
    async () => {
        return fetch(event.request)
    }
  )
});