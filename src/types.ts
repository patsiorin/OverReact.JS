import { EVENT_PROPS } from "./events";

export type HostType = keyof HTMLElementTagNameMap;

type EventHandlers = {
  [K in keyof typeof EVENT_PROPS]?: (
    event: HTMLElementEventMap[(typeof EVENT_PROPS)[K]],
  ) => void;
};

export type HostAttributes = {
  id?: string;
} & EventHandlers;

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
