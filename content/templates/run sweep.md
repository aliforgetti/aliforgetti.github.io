<%*
/* run sweep - phone/desktop trigger for the ONE sweep logic
   (templates/scripts/sweep_core.js). Same file the Mac's
   5-minute launchd job runs. No drift possible.

   Setup once (Settings -> Templater):
     - "User script functions" folder: templates/scripts
     - "Template hotkeys": add this file -> it becomes a
       command ("Templater: run sweep") you can run from the
       palette on the phone, or bind to the mobile toolbar.

   Run it from any note. It inserts nothing. */

const a = app.vault.adapter;
const env = {
  today: window.moment().format("YYYY-MM-DD"),
  read: (p) => a.read(p),
  write: (p, s) => a.write(p, s),
  listDaily: async () =>
    (await a.list("private/daily")).files.map(f => f.split("/").pop()),
  listStreams: async () => {
    const out = [];
    const walk = async (dir) => {
      const l = await a.list(dir);
      for (const d of l.folders) await walk(d);
      for (const f of l.files) if (f.endsWith(".md")) out.push(f);
    };
    await walk("private/streams");
    return out;
  },
};

try {
  const result = await tp.user.sweep_core(env);
  new Notice(result.summary, 8000);
} catch (e) {
  new Notice("sweep FAILED: " + e.message, 10000);
}
tR += "";
%>
