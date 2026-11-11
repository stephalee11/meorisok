/**
 * Loads a Google font as TTF for ImageResponse (satori can't read woff2).
 * Only the characters in `text` are fetched. Returns null on failure so the image still renders.
 */
export async function googleFont(family: string, weight: number, text: string): Promise<ArrayBuffer | null> {
  "use cache";
  try {
    const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!src) return null;
    const res = await fetch(src);
    return res.ok ? res.arrayBuffer() : null;
  } catch {
    return null;
  }
}
