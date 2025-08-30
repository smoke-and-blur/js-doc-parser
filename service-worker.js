self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.pathname !== "/share-target" || event.request.method !== "POST" || event.request.mode !== "navigate") {
    event.respondWith(fetch(event.request))
    return
  }

  console.log("share happened")

  console.log("request", event.request)

  event.respondWith((async () => {
    try {
      const formData = await event.request.formData();
      const files = formData.getAll("in"); // 'in' matches manifest

      let filenames = ""

      for (let file of files) {
        console.log(file.name, file.size)
        filenames += file.name + "\n"
      }

      // // Send files to the page
      // const clientsArr = await self.clients.matchAll({ type: "window" });
      // if (clientsArr.length > 0) {
      //   clientsArr[0].postMessage({ action: "share", files });
      // }



      // Respond with a basic HTML page with your form
      const html = `
      <!DOCTYPE html>
      <meta charset="utf-8">
      <html>
      <head><title>Edit Shared Files</title></head>
      <body>
        <h1>Edit Shared Files</h1>
        <p>${filenames}</p>
      </body>
      </html>
    `;


      return new Response(html, { headers: { "Content-Type": "text/html" } });
    } catch (e) {
      console.log("error:", e)
      return new Response(`<h1>Error</h1>`, { headers: { "Content-Type": "text/html" } });

    }
  })());
});
