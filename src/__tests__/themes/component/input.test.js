import { inputStyles } from "../../../theme/components/input"; // Ajuste le chemin

test("Input should have correct base styles", () => {
  const input = inputStyles.components.Input;
  expect(input.baseStyle.field.fontWeight).toBe(400);
});

test("Input auth variant should have correct styles", () => {
  const auth = inputStyles.components.Input.variants.auth({});
  expect(auth.field.bg).toBe("white");
  expect(auth.field.border).toBe("1px solid");
});

test("Input search variant should have correct styles", () => {
  const search = inputStyles.components.Input.variants.search({});
  expect(search.field.border).toBe("none");
  expect(search.field.py).toBe("11px");
});
