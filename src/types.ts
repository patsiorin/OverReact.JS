export type HostType = "div" | "span";
export type HostAttributes = {
  id?: string;
};
type HostProps = HostAttributes & {
  children?: OverReactElement[];
};

type TextProps = {
  nodeValue?: string;
};

export type OverReactElement =
  | {
      type: HostType;
      props: HostProps;
    }
  | {
      type: "TEXT_ELEMENT";
      props: TextProps;
    };
