import url from "node:url";
import puppeteer from "puppeteer";

main();

async function main() {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  const links: string[] = [];
  for (const i of [...Array(88).keys()]) {
    await page.goto(cbUrl(i + 1));
    const _links = await page.$$eval(".m-card-container>a", (elements) =>
      // @ts-ignore
      elements.map((e) => e.href)
    );
    console.log({ [`links${i}`]: _links });
    links.push(..._links);
  }

  const ranking = rank(
    countBy(links.map(url.parse).map((u) => u.host!.replace(/^www./, "")))
  );
  console.log({ ranking });

  await browser.close();
}

function cbUrl(i: number) {
  return `https://aws.amazon.com/jp/developer/community/community-builders/community-builders-directory/?cb-cards.sort-by=item.additionalFields.cbName&cb-cards.sort-order=asc&awsf.builder-category=*all&awsf.location=*all&awsf.year=*all&awsm.page-cb-cards=${i}`;
}

function countBy(arr: string[]) {
  return arr.reduce((acc, val) => {
    return { ...acc, [val]: (acc[val] ?? 0) + 1 };
  }, {} as Record<string, number>);
}

function rank(numObj: Record<string, number>) {
  return Object.fromEntries(Object.entries(numObj).sort((a, b) => b[1] - a[1]));
}
