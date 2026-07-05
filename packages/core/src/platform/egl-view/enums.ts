import type { ContainerStrategy } from "./container-strategy";
import type { ContentStrategy } from "./content-strategy";
import { ContainerStrategyKey, ContentStrategyKey } from "../../enums";
import {
  EqualToFrame,
  EqualToWindow,
  OriginalContainer,
  ProportionalToFrame,
  ProportionalToWindow
} from "./container-strategy";
import {
  ExactFit,
  FixedHeight,
  FixedWidth,
  NoBorder,
  ShowAll
} from "./content-strategy";

export const ContainerStrategyType: Record<
  ContainerStrategyKey,
  ContainerStrategy
> = Object.freeze({
  [ContainerStrategyKey.EQUAL_TO_FRAME]: new EqualToFrame(),
  [ContainerStrategyKey.PROPORTION_TO_FRAME]: new ProportionalToFrame(),
  [ContainerStrategyKey.EQUAL_TO_WINDOW]: new EqualToWindow(),
  [ContainerStrategyKey.PROPORTION_TO_WINDOW]: new ProportionalToWindow(),
  [ContainerStrategyKey.ORIGINAL_CONTAINER]: new OriginalContainer()
});

export type ContainerStrategyTypeValue =
  Record<ContainerStrategyKey, ContainerStrategy>[ContainerStrategyKey];

export const ContentStrategyType: Record<
  ContentStrategyKey,
  ContentStrategy
> = Object.freeze({
  [ContentStrategyKey.EXACT_FIT]: new ExactFit(),
  [ContentStrategyKey.SHOW_ALL]: new ShowAll(),
  [ContentStrategyKey.NO_BORDER]: new NoBorder(),
  [ContentStrategyKey.FIXED_HEIGHT]: new FixedHeight(),
  [ContentStrategyKey.FIXED_WIDTH]: new FixedWidth()
});
