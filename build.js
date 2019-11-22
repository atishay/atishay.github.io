const cp = require("child_process");
const rcs = require("rename-css-selectors");
const path = require("path");
const terser = require("terser");
const glob = require("glob");
const fs = require("fs");
const posthtml = require("posthtml");
(async () => {
  cp.execSync(`hugo --minify --baseURL ${process.env.DEPLOY_URL}`, { cwd: __dirname, stdio: [0, 1, 2] });
  rcs.loadMapping('./renaming_map.json');
  await rcs.process.auto(['**/*.js', '**/*.html', '**/*.css'], { newPath: 'public', cwd: path.resolve(__dirname, './public') });
  await rcs.generateMapping('./', { overwrite: true });
  glob("public/**/*.js", (err, matches) =>
    matches.forEach(m =>
      fs.writeFileSync(m, terser.minify(fs.readFileSync(m, { encoding: 'utf-8' }), {
        compress: {
          unsafe_arrows: true,
          unsafe_comps: true,
          unsafe_math: true,
          unsafe_methods: true,
          unsafe_proto: true,
          unsafe_regexp: true,
          unsafe_undefined: true,
        },
        warnings: true,
        mangle: {
          properties: true
        }
      }).code)
    ));
  // glob("public/index.html", (err, matches) =>
  //   matches.forEach(m =>
  //     posthtml([require('htmlnano')({}, require('htmlnano').presets.max)]).process(fs.readFileSync(m, 'utf-8')).then(r => fs.writeFileSync(m, r.html)).catch(e => console.log(e, e.stack))
  //   )
  // );
})();



