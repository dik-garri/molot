// Покадровый рендер видео: node render.mjs <story> [--fps 30] [--scale 2]
// Как в anim-kit-studio: страница рисует кадр по t (VIDEO.draw), звук синтезируется офлайн (VIDEO.audio → WAV),
// кадры и звук склеиваются ffmpeg в MP4 (H.264 + AAC, 9:16).
import puppeteer from "puppeteer-core";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const story = args[0] || "paper";
const opt = (k, d) => { const i = args.indexOf("--" + k); return i > 0 ? +args[i + 1] : d; };
const fps = opt("fps", 30), scale = opt("scale", 2);
const out = path.join(here, "out"); fs.mkdirSync(out, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new", args: ["--allow-file-access-from-files", "--autoplay-policy=no-user-gesture-required"]
});
const page = await browser.newPage();
await page.setViewport({ width: 540, height: 960, deviceScaleFactor: scale });
const url = pathToFileURL(path.join(here, "player.html")).href + `?story=${story}&render=1&t=0`;
await page.goto(url, { waitUntil: "networkidle0" });
await page.evaluate(() => window.VIDEO.ready);
const D = await page.evaluate(() => window.VIDEO.duration);

const wavPath = path.join(out, `${story}.wav`);
fs.writeFileSync(wavPath, Buffer.from(await page.evaluate(() => window.VIDEO.audio()), "base64"));

const mp4 = path.join(out, `${story}.mp4`);
const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(fps), "-i", "-", "-i", wavPath,
  "-c:v", "libx264", "-preset", "slow", "-crf", "22", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", mp4],
  { stdio: ["pipe", "inherit", "inherit"] });
const frame = await page.$("#frame");
const N = Math.round(D * fps), t0 = Date.now();
for (let i = 0; i < N; i++) {
  await page.evaluate(t => window.VIDEO.draw(t), i / fps);
  const buf = await frame.screenshot({ type: "jpeg", quality: 92 });
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once("drain", r));
  if (i % 60 === 0) process.stdout.write(`\r${story}: кадр ${i}/${N} · ${((Date.now() - t0) / 1000).toFixed(0)} с`);
}
ff.stdin.end();
await new Promise(r => ff.on("close", r));
await browser.close();
fs.unlinkSync(wavPath);
console.log(`\n${story}: готово → ${path.relative(process.cwd(), mp4)}`);
