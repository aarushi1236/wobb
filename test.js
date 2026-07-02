async function test() {
  const res = await fetch('https://www.instagram.com/cristiano/');
  const text = await res.text();
  const match = text.match(/<meta property="og:image" content="([^"]+)"/);
  console.log(match ? match[1] : "No match");
}
test();
