import { describe, expect, it } from "vitest";
import type { CollectionFilterFacet } from "./collections";
import {
  chipsForAppliedFilters,
  decodeCollectionFiltersParam,
  encodeCollectionFiltersParam,
  filterInputKey,
  normalizeProductFilterInput,
  normalizeProductFiltersList,
  removeFilterByInputKey,
  selectFacetFilterValue,
} from "./collection-filters";

describe("normalizeProductFilterInput", () => {
  it("null / undefined は null", () => {
    expect(normalizeProductFilterInput(null)).toBeNull();
    expect(normalizeProductFilterInput(undefined)).toBeNull();
  });

  it("オブジェクトはそのまま Record として返す", () => {
    const input = { productVendor: "Acme" };
    expect(normalizeProductFilterInput(input)).toEqual(input);
  });

  it("JSON 文字列はパースしてオブジェクト化する", () => {
    const obj = { tag: "sale" };
    expect(normalizeProductFilterInput(JSON.stringify(obj))).toEqual(obj);
  });

  it("パース結果が配列なら null", () => {
    expect(normalizeProductFilterInput(JSON.stringify([1, 2]))).toBeNull();
  });

  it("不正な JSON 文字列は null", () => {
    expect(normalizeProductFilterInput("{not json")).toBeNull();
  });

  it("配列・プリミティブは null", () => {
    expect(normalizeProductFilterInput([])).toBeNull();
    expect(normalizeProductFilterInput(1)).toBeNull();
    expect(normalizeProductFilterInput("plain")).toBeNull();
  });
});

describe("normalizeProductFiltersList", () => {
  it("無効要素は取り除く", () => {
    expect(
      normalizeProductFiltersList([
        { a: 1 },
        "[1,2]",
        JSON.stringify({ b: 2 }),
      ])
    ).toEqual([{ a: 1 }, { b: 2 }]);
  });
});

describe("encodeCollectionFiltersParam / decodeCollectionFiltersParam", () => {
  it("空配列は往復で空配列", () => {
    const encoded = encodeCollectionFiltersParam([]);
    expect(encoded).toBeTruthy();
    expect(decodeCollectionFiltersParam(encoded)).toEqual([]);
  });

  it("フィルタ一覧を往復して保持する", () => {
    const filters = [{ price: { min: 10, max: 100 } }, { available: true }];
    const encoded = encodeCollectionFiltersParam(filters);
    expect(decodeCollectionFiltersParam(encoded)).toEqual(filters);
  });

  it("不正な param は空配列", () => {
    expect(decodeCollectionFiltersParam(undefined)).toEqual([]);
    expect(decodeCollectionFiltersParam("")).toEqual([]);
    expect(decodeCollectionFiltersParam("@@@")).toEqual([]);
  });
});

describe("filterInputKey", () => {
  it("文字列とオブジェクトで同じ論理キーなら一致する", () => {
    const obj = { tag: "x" };
    const keyFromObj = filterInputKey(obj);
    const keyFromStr = filterInputKey(JSON.stringify(obj));
    expect(keyFromObj).toBe(keyFromStr);
  });
});

describe("selectFacetFilterValue", () => {
  const facets: CollectionFilterFacet[] = [
    {
      id: "vendor",
      label: "Vendor",
      type: "LIST",
      values: [
        { id: "v-acme", label: "Acme", count: 2, input: { productVendor: "Acme" } },
        { id: "v-beta", label: "Beta", count: 1, input: { productVendor: "Beta" } },
      ],
    },
  ];

  it("該当ファセットが無ければ applied をそのまま返す", () => {
    const applied = [{ productVendor: "Acme" }];
    expect(selectFacetFilterValue(facets, "missing", "v-acme", applied)).toEqual(applied);
  });

  it("該当値が無ければ applied をそのまま返す", () => {
    const applied = [{ productVendor: "Acme" }];
    expect(selectFacetFilterValue(facets, "vendor", "no-such", applied)).toEqual(
      applied
    );
  });

  it("未選択ならその値を追加する", () => {
    expect(selectFacetFilterValue(facets, "vendor", "v-acme", [])).toEqual([
      { productVendor: "Acme" },
    ]);
  });

  it("既にアクティブな値を再度選ぶとトグルで外す", () => {
    const applied = [{ productVendor: "Acme" }];
    expect(selectFacetFilterValue(facets, "vendor", "v-acme", applied)).toEqual([]);
  });

  it("同一ファセット内は単一選択（別値に差し替え）", () => {
    const applied = [{ productVendor: "Acme" }];
    expect(selectFacetFilterValue(facets, "vendor", "v-beta", applied)).toEqual([
      { productVendor: "Beta" },
    ]);
  });
});

describe("removeFilterByInputKey", () => {
  it("inputKey が一致する要素だけ除く", () => {
    const a = { productVendor: "Acme" };
    const b = { available: true };
    const applied = [a, b];
    const key = filterInputKey(a);
    expect(removeFilterByInputKey(applied, key)).toEqual([b]);
  });
});

describe("chipsForAppliedFilters", () => {
  const facets: CollectionFilterFacet[] = [
    {
      id: "vendor",
      label: "Vendor",
      type: "LIST",
      values: [
        { id: "v-acme", label: "Acme", count: 1, input: { productVendor: "Acme" } },
      ],
    },
  ];

  it("ファセットに載る入力はラベル付きで返す", () => {
    expect(chipsForAppliedFilters(facets, [{ productVendor: "Acme" }])).toEqual([
      { inputKey: filterInputKey({ productVendor: "Acme" }), label: "Vendor: Acme" },
    ]);
  });

  it("未知の入力は inputKey をラベルにする", () => {
    const unknown = { unknown: true };
    const key = filterInputKey(unknown);
    expect(chipsForAppliedFilters(facets, [unknown])).toEqual([
      { inputKey: key, label: key },
    ]);
  });
});
