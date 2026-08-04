import { describe, expect, it } from "vitest";

import { erc20Abi } from "./erc20";

function findFunction(name: string) {
  return erc20Abi.find(
    (item) => item.type === "function" && item.name === name,
  );
}

describe("erc20Abi", () => {
  it("exposes balanceOf(address) -> uint256", () => {
    const fn = findFunction("balanceOf");

    expect(fn).toBeDefined();
    expect(fn?.stateMutability).toBe("view");
    expect(fn?.inputs).toEqual([{ name: "account", type: "address" }]);
    expect(fn?.outputs).toEqual([{ name: "", type: "uint256" }]);
  });

  it("exposes decimals() -> uint8", () => {
    const fn = findFunction("decimals");

    expect(fn).toBeDefined();
    expect(fn?.stateMutability).toBe("view");
    expect(fn?.outputs).toEqual([{ name: "", type: "uint8" }]);
  });

  it("exposes symbol() -> string", () => {
    const fn = findFunction("symbol");

    expect(fn).toBeDefined();
    expect(fn?.stateMutability).toBe("view");
    expect(fn?.outputs).toEqual([{ name: "", type: "string" }]);
  });

  it("exposes name() -> string", () => {
    const fn = findFunction("name");

    expect(fn).toBeDefined();
    expect(fn?.stateMutability).toBe("view");
    expect(fn?.outputs).toEqual([{ name: "", type: "string" }]);
  });

  it("does not expose any write functions", () => {
    const writeFunctionNames = erc20Abi
      .filter((item) => item.type === "function")
      .filter((item) => item.stateMutability !== "view")
      .map((item) => item.name);

    expect(writeFunctionNames).toEqual([]);
  });
});
