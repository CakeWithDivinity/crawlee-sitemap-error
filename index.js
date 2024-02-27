import { RobotsFile } from "crawlee";

const robots = await RobotsFile.load("https://7even.de/robots.txt");

try {
  const urls = await robots.parseUrlsFromSitemaps();
  console.log(urls);
} catch (error) {
  console.error("This error will not be logged: ", error);
}
