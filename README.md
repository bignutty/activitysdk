# ActivitySDK

| activitysdk-ts | activitysdk |
| :------------: | :---------: |
| ![npm](https://img.shields.io/npm/v/activitysdk-ts) | ![npm](https://img.shields.io/npm/v/activitysdk) |

Typescript fork of [activitysdk](http://npmjs.org/activitysdk).

**Example usage:**  
_you **need** to use a bundler such as [vite](https://vitejs.dev/) or [webpack](https://webpack.js.org/) or any bundler you like._
```js
import ActivitySDK from "activitysdk-ts";

const sdk = new ActivitySDK("app id");

sdk.on("READY", async () => {
  let user;
  try {
    user = (await sdk.login("app secret", ["identify"])).user;
  } catch (e) {
    console.error("could not authorize/authenticate");
    return;
  }
  
  const info = document.createElement("div");
  info.style.backgroundColor = "gray";
  info.style.display = "inline-block";
  
  const username = document.createElement("p");
  username.innerText = user.username;
  username.style.color = "cyan";
  
  info.append("Hello ", username);
  document.body.append(info);
});
```
