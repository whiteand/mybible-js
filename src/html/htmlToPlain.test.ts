import { describe, expect, it } from "vitest";
import { htmlToPlain, streamToPlain } from "./htmlToPlain.ts";

function plain(textHtml: string): string {
  return Array.from(htmlToPlain(textHtml)).join("");
}

describe("htmlToPlain", () => {
  it("returns text that has no tags unchanged", () => {
    expect(plain("In the beginning")).toBe("In the beginning");
    expect(plain("")).toBe("");
  });

  it.each([
    {
      name: "drops Strong's numbers and turns a paragraph break into blank lines",
      html: "<pb/>In<S>1722</S> the beginning<S>746</S> was<S>1510</S> the<S>3588</S> Word,<S>3056</S> and<S>2532</S> the<S>3588</S> Word<S>3056</S> was<S>1510</S> with<S>4314</S><S>3588</S> God,<S>2316</S> and<S>2532</S> the<S>3588</S> Word<S>3056</S> was<S>1510</S> God.<S>2316</S>",
      expected:
        "\n  In the beginning was the Word, and the Word was with God, and the Word was God.",
    },
    {
      name: "drops footnotes",
      html: "<pb/>На поча́тку Бог створив небо<f>[1]</f> та землю.",
      expected: "\n  На поча́тку Бог створив небо та землю.",
    },
    {
      name: "drops morphology codes",
      html: "Ἐν<S>1722</S><m>PREP</m> ἀρχῇ<S>746</S><m>N-DSF</m> ἦν<S>1510</S><m>V-IAI-3S</m> ὁ<S>3588</S><m>T-NSM</m> λόγος,<S>3056</S><m>N-NSM</m>",
      expected: "Ἐν ἀρχῇ ἦν ὁ λόγος,",
    },
    {
      name: "drops translator notes and keeps small-print markers",
      html: '<e>Τοῦ</e><S>3588</S><m>T-GSM</m> <n>Tou</n> →<small class="far">5</small> <e>δὲ</e><S>1161</S><m>CONJ</m> <n>de</n> Now',
      expected: "Τοῦ  →5 δὲ  Now",
    },
    {
      name: "keeps emphasized words without the emphasis marks",
      html: "<pb/><e>да не будет у тебя других<S>312</S> богов<S>430</S></e> пред лицем<S>5921</S><S>6440</S> Моим.",
      expected: "\n  да не будет у тебя других богов пред лицем Моим.",
    },
    {
      name: "keeps Jesus' words and drops Strong's numbers inside them",
      html: 'But Jesus<S>2424</S> answering<S>611</S> said<S>3004</S> to him, <J>"Permit<S>863</S> [it] at this<S>737</S> time;<S>737</S> for in this<S>3779</S> way<S>3779</S> it is fitting<S>4241</S> for us to fulfill<S>4137</S> all<S>3956</S> righteousness.<S>1343</S>"</J> Then<S>5119</S> he permitted<S>863</S> Him.',
      expected:
        'But Jesus answering said to him, "Permit [it] at this time; for in this way it is fitting for us to fulfill all righteousness." Then he permitted Him.',
    },
    {
      name: "wraps inserted words in brackets, including words that contain Strong's numbers",
      html: "<f>ⓜ</f>Вони<S>3739</S> <i>не<S>3756</S> народилися</i> ні<S>3761</S> від<S>1537</S> крові,<S>129</S> ні<S>3761</S> через<S>1537</S> тілесне<S>4561</S> бажання,<S>2307</S> ні через<S>1537</S> бажання<S>2307</S> чоловіка,<S>435</S> але<S>235</S> народилися<S>1080</S> від<S>1537</S> Бога.<S>2316</S>",
      expected:
        "Вони [не народилися] ні від крові, ні через тілесне бажання, ні через бажання чоловіка, але народилися від Бога.",
    },
    {
      name: "wraps a subheading in asterisks",
      html: "І сталося, коли Ізраїль перебував у тім краї, то Рувим пішов і ліг із Білгою, наложницею батька свого. І почув Ізраїль, і було це злим йому. <pb/><h>Нащадки Якова</h> <pb/>А в Якова було дванадцятеро синів.",
      expected:
        "І сталося, коли Ізраїль перебував у тім краї, то Рувим пішов і ліг із Білгою, наложницею батька свого. І почув Ізраїль, і було це злим йому. \n  *Нащадки Якова* \n  А в Якова було дванадцятеро синів.",
    },
    {
      name: "indents a poetry line",
      html: "<t>And God<S>430</S> created<S>1254</S> man<S>120</S> in His own image,<S>6754</S> in the image<S>6754</S> of God<S>430</S> He created<S>1254</S> him; male<S>2145</S> and female<S>5347</S> He created<S>1254</S> them.</t>",
      expected:
        "\n  And God created man in His own image, in the image of God He created him; male and female He created them.\n",
    },
    {
      name: "breaks a line after an indented quotation",
      html: "И сказал<S>559</S> человек:<S>120</S> <t>вот,<S>6471</S> это<S>2063</S> кость<S>6106</S> от костей<S>6106</S> моих и плоть<S>1320</S> от плоти<S>1320</S> моей; она<S>2063</S> будет называться<S>7121</S> женою,<S>802</S> ибо взята<S>3947</S> от мужа.<S>376</S></t><br/>",
      expected:
        "И сказал человек: \n  вот, это кость от костей моих и плоть от плоти моей; она будет называться женою, ибо взята от мужа.\n\n",
    },
    {
      name: "keeps a Greek quotation and drops Strong's numbers, morphology, and emphasis marks",
      html: "<t><e>Ἰδοὺ<S>3708</S><m>V-2AMM-2S</m> ἡ<S>3588</S><m>T-NSF</m> παρθένος<S>3933</S><m>N-NSF</m> ἐν<S>1722</S><m>PREP</m> γαστρὶ<S>1064</S><m>N-DSF</m> ἕξει<S>2192</S><m>V-FAI-3S</m> καὶ<S>2532</S><m>CONJ</m> τέξεται<S>5088</S><m>V-FDI-3S</m> υἱόν,<S>5207</S><m>N-ASM</m><br/>καὶ<S>2532</S><m>CONJ</m> καλέσουσιν<S>2564</S><m>V-FAI-3P</m> τὸ<S>3588</S><m>T-ASN</m> ὄνομα<S>3686</S><m>N-ASN</m> αὐτοῦ<S>846</S><m>P-GSM</m> Ἐμμανουήλ,<S>1694</S><m>N-PRI</m></e></t><br/>ὅ<S>3739</S><m>R-NSN</m> ἐστιν<S>1510</S><m>V-PAI-3S</m> μεθερμηνευόμενον<S>3177</S><m>V-PPP-NSN</m> <e>Μεθ᾽<S>3326</S><m>PREP</m> ἡμῶν<S>1473</S><m>P-1GP</m> ὁ<S>3588</S><m>T-NSM</m> θεός.<S>2316</S><m>N-NSM</m></e>",
      expected:
        "\n  Ἰδοὺ ἡ παρθένος ἐν γαστρὶ ἕξει καὶ τέξεται υἱόν,\nκαὶ καλέσουσιν τὸ ὄνομα αὐτοῦ Ἐμμανουήλ,\n\nὅ ἐστιν μεθερμηνευόμενον Μεθ᾽ ἡμῶν ὁ θεός.",
    },
  ])("$name", ({ html, expected }) => {
    expect(plain(html)).toBe(expected);
  });
});

describe("streamToPlain", () => {
  it("throws when a tag has no plain-text rule", () => {
    expect(() =>
      Array.from(streamToPlain([{ action: "leave", tagName: "footnote" }])),
    ).toThrow("Cannot handle tag: leave:footnote");
  });
});
