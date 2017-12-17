import { Injectable } from '@angular/core';


@Injectable()
export class EmojiServiceProvider {

  constructor() { }

  getEmojis() {
    const EMOJIS =
    "😀 😃 😄 😁 😆 😅 😂 ☺️ 😊 😇 🙂 🙃 😉 😌 😍 😘 😗 😙 😚 😋 😜 😝 😛 🤑 🤗 🤓 😎 😏 😒 😞 😔 😟 😕 🙁 " +
    "☹️ 😣 😖 😫 😩 😤 😠 😡 😶 😐 😑 😯 😦 😧 😮 😲 😵 😳 😱 😨 😰 😢 😥 😭 😓 😪 😴 🙄 🤔 😬 🤐 😷 🤒 🤕 😈 👿" +
    " 👹 👺 💩 👻 💀 ☠️ 👽 👾 🤖 🎃 😺 😸 😹 😻 😼 😽 🙀 😿 😾 👐 🙌 👏 🙏 👍 👎 👊 ✊ ✌️ 🤘 👌 👈 👉 👆 👇 ☝️ ✋" +
    " 🖐 🖖 👋 💪 🖕 ✍️ 💅 🖖 ❤️ 💛 💚 💙 💜 💔 ❣️ 💕 💞 💓 💗 💖 💘 💝 💄 💋 👄 👅 👂 👃 👣 👁 👀 🗣 👤 👥" +
    "️ 🙎 🕴 💃 👯 👫 👭 👬 💑 👩‍❤️‍👩 👨‍❤️‍👨 💏 👩‍❤️‍💋‍👩 👨‍❤️‍💋‍👨 👪" +
    " 👚 👕 👖 👔 👗 👙 👘 👠 👡 👢 👞 👟 👒 🎩 🎓 👑 ⛑ 🎒 👝 👛 💼" +
    " 🐶 🐱 🐭 🐹 🐰 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐽 🐸 🐵 🙊 🙉 🙊 🐺 🐗 🐴 🦄 🐝 🐛 🐢 🐍 🐒 🐔 🐧 🐦 🐤 🐣 🐥 🐩 🐈 🐓 🦃 🕊 🐇 🐁 🐀 🐿 🐾 🐉 🐲" +
    " 🌙 💫 ⭐️ 🌟 ✨ ⚡️ 🔥 💥 ☄️ ☀️ 🌤 ⛅️ 🌥 🌦 🌧 ⛈ 🌩 🌨 ☃️ ⛄️ ❄️ 🌬 💨 🌪💧 💦 ☔️ 🌂 ☂️ ⛴ 🛳 🛩 ✈️ 🚀 💯 ✅ ⚠️ 🔞 💢 ❗️ ❕ ❓ ❔ ‼️ ⁉️";

    let EmojiArr = EMOJIS.split(' ');
    let groupNum = Math.ceil(EmojiArr.length / (24));
    let items = [];

    for (let i = 0; i < groupNum; i++) {
        items.push(EmojiArr.slice(i * 24, (i + 1) * 24));
    }
    return items;
    }
}
