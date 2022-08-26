# Programmable doc

### sample code

```
async function hide(clzs, ms) {
  for (const c of clzs) {
    P._$(`.${c}`).forEach((e) => (e.opacity = 0));
  }
  P._update();
  if (ms) {
    await P._sleep(ms);
  }
}

async function show(clzs, ms) {
  for (const c of clzs) {
    P._$(`.${c}`).forEach((e) => (e.opacity = 80));
  }
  P._update();
  if (ms) {
    await P._sleep(ms);
  }
}
async function shineShow(clzs, ms, times) {
  for (let i = 0; i < times; i++) {
    await show(clzs, ms);
    await hide(clzs, ms);
  }
  await show(clzs);
}

async function run() {
  await hide(["q1.5", "q1", "q2", "qa"], 3000);

  await show(["q1"], 3000);
  await show(["q1.5"], 1000);
  await show(["q2"], 3000);

  await shineShow(["qa"], 1000, 3);
}
const I18N = {
  hello: {
    en: "hello",
    cn: "你好",
  },
};
async function i18n(lang) {
  P._$("text").forEach((e) => {
    let txt = e.text;
    let starter = txt.indexOf("${");
    while (starter >= 0) {
      const end = txt.indexOf("}", starter + 2);
      if (end <= 0) {
        break;
      }
      const variable = txt.substring(starter + 2, end);
      const trans = I18N[variable];
      if (trans) {
        let to = trans[lang];
        if(!to){
          to = variable;
        }
        txt = txt.replace(`\${${variable}}`, to);
        starter = txt.indexOf("${");
      } else {
        txt = txt.replace(`\${${variable}}`, variable);
      }
      e.text = txt;
    }
  });
}
```
