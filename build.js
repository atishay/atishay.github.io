const cp = require("child_process");
const rcs = require("rename-css-selectors");
const path = require("path");
(async () => {
  await cp.exec("hugo --minify --baseURL $URL", { cwd: __dirname, stdio: [0, 1, 2] });
      rcs.loadMapping('./renaming_map.json');
  await rcs.process.auto(['**/*.js', '**/*.html', '**/*.css'], { overwrite: true, cwd: path.resolve(__dirname, './public') }).catch(e => console.log(e, e.stack));
      await rcs.generateMapping('./', { overwrite: true }).catch(e => console.log(e.stack));
  })();


