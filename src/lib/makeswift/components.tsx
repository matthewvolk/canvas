import { Style } from "@makeswift/runtime/controls";

import { runtime } from "@/lib/makeswift/runtime";

function HelloWorld(props: React.ComponentProps<"p">) {
  return <p {...props}>Hello, world!</p>;
}

runtime.registerComponent(HelloWorld, {
  type: "hello-world",
  label: "Hello, world!",
  props: {
    className: Style(),
  },
});
