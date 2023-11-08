import watch from "node-watch";

class Iterator {
  latestResolve = null;
  [Symbol.asyncIterator]() {
    return this;
  }

  next() {
    const value = new Promise((resolve) => {
      this.latestResolve = resolve;
    });
    return {
      done: false,
      value,
    };
  }

  add(name) {
    this.latestResolve(`File ${String(name).toUpperCase()} changed`);
  }
}

const iterator = new Iterator();

watch("./a", () => {
  iterator.add("a");
});
watch("./b", () => {
  iterator.add("b");
});
watch("./c", () => {
  iterator.add("c");
});

(async () => {
  for await (const value of iterator) {
    const resolvedValue = await value;
    console.log(resolvedValue);
  }
})();
