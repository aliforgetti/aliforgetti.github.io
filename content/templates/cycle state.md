<%*
/* CYCLE STATE - steps the current line through
       none -> #soon -> #now -> #waiting -> none

   Runs in the EDITOR on the line the cursor is on, so it
   works anywhere a task lives - stream, daily note,
   backlog. No rendered-view click handling involved.

   Setup once:
     Settings -> Templater -> Template hotkeys -> add this file
     Settings -> Hotkeys -> search "cycle state" -> bind a key
       (suggestion: Cmd+Shift+S)
     Phone: run it from the command palette, or add it to the
       mobile toolbar (Settings -> Mobile -> Manage toolbar)

   Flow: click a task on the board (jumps to the real line),
   press the hotkey until the state is what you want. */

const ed = app.workspace.activeEditor?.editor;
if (!ed) {
  new Notice("cycle state: no editor - click into the note first");
} else {
  const cur = ed.getCursor();
  let line = ed.getLine(cur.line);
  const order = [null, "soon", "now", "waiting"];
  const m = line.match(/#(now|soon|waiting)(?![\w/])/);
  const idx = m ? order.indexOf(m[1]) : 0;
  const next = order[(idx + 1) % order.length];
  line = line.replace(/[ \t]*#(now|soon|waiting|focus)(?![\w/])/g, "");
  if (next) line = line.replace(/[ \t]+$/, "") + " #" + next;
  ed.setLine(cur.line, line);
  new Notice(next ? "-> #" + next : "-> no state (possible)");
}
tR = "";
%>
