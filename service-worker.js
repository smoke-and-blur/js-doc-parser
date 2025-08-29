self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.pathname !== "/share-target" || event.request.method !== "POST") return;

  event.respondWith((async () => {
    const formData = await event.request.formData();
    const files = formData.getAll("in"); // 'in' matches manifest

    // Send files to the page
    const clientsArr = await self.clients.matchAll({ type: "window" });
    if (clientsArr.length > 0) {
      clientsArr[0].postMessage({ action: "share", files });
    }

    // Respond with a basic HTML page with your form
    const html = `
      <!DOCTYPE html>
      <html>
      <head><title>Edit Shared Files</title></head>
      <body>
        <h1>Edit Shared Files</h1>
        <form id="fileForm">
          <div id="fileInputs"></div>
          <button type="submit">Send</button>
        </form>
        <script>
          const sharedFiles = [];
          navigator.serviceWorker.addEventListener('message', event => {
            if (event.data.action === 'share') {
              sharedFiles.push(...event.data.files);
              const container = document.getElementById('fileInputs');
              sharedFiles.forEach((file, i) => {
                const label = document.createElement('label');
                label.textContent = file.name;
                const select = document.createElement('select');
                select.name = 'file' + i;
                ['a','b'].forEach(opt => {
                  const option = document.createElement('option');
                  option.value = opt;
                  option.textContent = opt;
                  select.appendChild(option);
                });
                container.appendChild(label);
                container.appendChild(select);
                container.appendChild(document.createElement('br'));
              });
            }
          });

          document.getElementById('fileForm').addEventListener('submit', async e => {
            e.preventDefault();
            const form = new FormData();
            sharedFiles.forEach((file, i) => {
              const select = document.querySelector('select[name=file'+i+']');
              form.append(select.value, file); // send file under 'a' or 'b'
            });

            // send to your server
            await fetch('/upload', { method: 'POST', body: form });
            alert('Files sent!');
          });
        </script>
      </body>
      </html>
    `;

    return new Response(html, { headers: { "Content-Type": "text/html" } });
  })());
});
